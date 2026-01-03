"use server"

import { ensureGuestSessionId } from "@/actions/ensure-guest-session-id"
import { COOKIE_KEYS } from "@/constants/keys"
import {
  CartInsufficientStockError,
  CartNotFound,
  CartPriceMismatchError,
  CartProductNotFoundError,
  CartProductOutOfStockError,
} from "@/errors"
import { Cart } from "@/payload-types"
import config from "@/payload.config"
import { formatCartItems } from "@/utils/format-cart-items"
import { cookies as getCookies } from "next/headers"
import { getPayload } from "payload"
import z from "zod"
import { getCurrentUser } from "./auth/get-current-user"

export async function getCart() {
  const [payload, cookies, user] = await Promise.all([
    getPayload({ config }),
    getCookies(),
    getCurrentUser(),
  ])

  const guestSessionId = cookies.get(COOKIE_KEYS.GUEST_SESSION_ID)?.value

  const { docs: carts } = await payload.find({
    collection: "carts",
    where: {
      ...(user
        ? {
            user: {
              equals: user.id,
            },
          }
        : {
            guestSessionId: {
              equals: guestSessionId,
            },
          }),
    },
    select: {
      items: true,
    },
    limit: 1,
    pagination: false,
  })

  if (carts.length === 0) return null

  const cart = carts[0]

  const formattedCartItems = formatCartItems(cart.items)

  return {
    ...cart,
    items: formattedCartItems,
  }
}

const createCartWithItemSchema = z.object({
  item: z.uuid("Product line ID must be a valid UUID"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be a positive number"),
})

// This does not check for existing carts, it always creates a new one.
// Handle existing cart logic separately.
export async function createCartWithItem(
  input: z.infer<typeof createCartWithItemSchema>
) {
  const { item, quantity, price } = createCartWithItemSchema.parse(input)

  const [payload, guestSessionId, user] = await Promise.all([
    getPayload({ config }),
    ensureGuestSessionId(),
    getCurrentUser(),
  ])

  // find the corrosponding product line, inorder to verify prices and stocks
  const { docs: producLines } = await payload.find({
    collection: "product-lines",
    where: {
      id: {
        equals: item,
      },
      active: {
        equals: true,
      },
      retailPrice: {
        exists: true,
      },
    },
    select: {
      retailPrice: true,
      stock: true,
      srcStock: true,
      isOutOfStock: true,
    },
    limit: 1,
    pagination: false,
  })

  const productLine = producLines.find((pl) => pl.id === item)

  // incase the product line is not found
  if (!productLine) {
    throw new CartProductNotFoundError([item])
  }

  // check stock
  if (productLine.isOutOfStock) {
    throw new CartProductOutOfStockError(item)
  }

  // check requested quantity against available stock
  const availableStock = productLine.srcStock ?? productLine.stock

  if (quantity > availableStock) {
    throw new CartInsufficientStockError(item, availableStock)
  }

  // validate price
  if (price !== productLine.retailPrice) {
    throw new CartPriceMismatchError(item, productLine.retailPrice!, price)
  }

  const newCart = await payload.create({
    collection: "carts",
    data: {
      guestSessionId: user ? undefined : guestSessionId,
      user: user?.id,
      items: [
        {
          productLine: item,
          quantity,
          snapshot: {
            retailPrice: productLine.retailPrice!,
            inventoryStock: productLine.stock,
            virtualStock: productLine.srcStock || 0,
          },
        },
      ],
      lastActiveAt: new Date().toISOString(),
    },
    user: user?.id,
  })

  return {
    id: newCart.id,
    items: formatCartItems(newCart.items),
  }
}

const addItemToCartSchema = z.object({
  item: z.uuid("Product line ID must be a valid UUID"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be a positive number"),
})

export async function addItemToCart(
  input: z.infer<typeof addItemToCartSchema>
) {
  const { item, quantity, price } = addItemToCartSchema.parse(input)

  const [payload, guestSessionId, user] = await Promise.all([
    getPayload({ config }),
    ensureGuestSessionId(),
    getCurrentUser(),
  ])

  // get the cart
  const { docs: carts } = await payload.find({
    collection: "carts",
    where: {
      ...(user
        ? {
            user: {
              equals: user.id,
            },
          }
        : {
            guestSessionId: {
              equals: guestSessionId,
            },
          }),
      "items.productLine": {
        not_equals: item,
      },
    },
  })

  if (carts.length === 0) {
    throw new CartNotFound()
  }

  // find the corrosponding product line, inorder to verify prices and stocks
  const { docs: producLines } = await payload.find({
    collection: "product-lines",
    where: {
      id: {
        equals: item,
      },
      active: {
        equals: true,
      },
      retailPrice: {
        exists: true,
      },
    },
    select: {
      retailPrice: true,
      stock: true,
      srcStock: true,
      isOutOfStock: true,
    },
    user: user?.id,
    overrideAccess: false,
    limit: 1,
    pagination: false,
  })

  const productLine = producLines.find((pl) => pl.id === item)

  // incase the product line is not found
  if (!productLine) {
    throw new CartProductNotFoundError([item])
  }

  // check stock
  if (productLine.isOutOfStock) {
    throw new CartProductOutOfStockError(item)
  }

  // check requested quantity against available stock
  const availableStock = productLine.srcStock ?? productLine.stock

  if (quantity > availableStock) {
    throw new CartInsufficientStockError(item, availableStock)
  }

  // validate price
  if (price !== productLine.retailPrice) {
    throw new CartPriceMismatchError(item, productLine.retailPrice!, price)
  }

  const cart = carts[0]

  const updateCart: Cart = {
    ...cart,
    user: user?.id,
    guestSessionId: guestSessionId,
    lastActiveAt: new Date().toISOString(),
    items: [
      ...cart.items,
      {
        productLine: item,
        quantity,
        snapshot: {
          retailPrice: productLine.retailPrice!,
          inventoryStock: productLine.stock,
          virtualStock: productLine.srcStock || 0,
        },
      },
    ],
  }

  const updatedCart = await payload.update({
    collection: "carts",
    id: cart.id,
    data: updateCart,
    user: user?.id,
  })

  return {
    id: updatedCart.id,
    items: formatCartItems(updatedCart.items),
  }
}

const updateCartItemQuantitySchema = z.object({
  item: z.uuid("Product line ID must be a valid UUID"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be a positive number"),
})

export async function updateCartItemQuantity(
  input: z.infer<typeof updateCartItemQuantitySchema>
) {
  const { item, quantity, price } = updateCartItemQuantitySchema.parse(input)

  const [payload, guestSessionId, user] = await Promise.all([
    getPayload({ config }),
    ensureGuestSessionId(),
    getCurrentUser(),
  ])

  // get the cart
  const { docs: carts } = await payload.find({
    collection: "carts",
    where: {
      ...(user
        ? {
            user: {
              equals: user.id,
            },
          }
        : {
            guestSessionId: {
              equals: guestSessionId,
            },
          }),
    },
  })

  if (carts.length === 0) {
    throw new CartNotFound()
  }

  const cart = carts[0]

  const cartItem = cart.items.find((cartItem) =>
    typeof cartItem.productLine === "string"
      ? cartItem.productLine === item
      : cartItem.productLine.id === item
  )

  if (!cartItem) {
    throw new CartProductNotFoundError([item])
  }

  // if the quantity is same do not waste time
  if (cartItem.quantity === quantity) {
    return {
      id: cart.id,
      items: formatCartItems(cart.items),
    }
  }

  // find the corrosponding product line, inorder to verify prices and stocks
  const { docs: producLines } = await payload.find({
    collection: "product-lines",
    where: {
      id: {
        equals: item,
      },
      active: {
        equals: true,
      },
      retailPrice: {
        exists: true,
      },
    },
    select: {
      retailPrice: true,
      stock: true,
      srcStock: true,
      isOutOfStock: true,
    },
    limit: 1,
    pagination: false,
  })

  const productLine = producLines.find((pl) => pl.id === item)

  // incase the product line is not found
  if (!productLine) {
    throw new CartProductNotFoundError([item])
  }

  // check stock
  if (productLine.isOutOfStock) {
    throw new CartProductOutOfStockError(item)
  }

  // check requested quantity against available stock
  const availableStock = productLine.srcStock ?? productLine.stock

  if (quantity > availableStock) {
    throw new CartInsufficientStockError(item, availableStock)
  }

  // validate price
  if (price !== productLine.retailPrice) {
    throw new CartPriceMismatchError(item, productLine.retailPrice!, price)
  }

  const updateCart: Cart = {
    ...cart,
    user: user?.id,
    guestSessionId: guestSessionId ?? undefined,
    lastActiveAt: new Date().toISOString(),
    items: cart.items.map((cartItem) => {
      const productLineId =
        typeof cartItem.productLine === "string"
          ? cartItem.productLine
          : cartItem.productLine.id

      const updatedCartItem = {
        ...cartItem,
        quantity,
        snapshot: {
          retailPrice: productLine.retailPrice!,
          inventoryStock: productLine.stock,
          virtualStock: productLine.srcStock || 0,
        },
      }
      return productLineId === item ? updatedCartItem : cartItem
    }),
  }

  const updatedCart = await payload.update({
    collection: "carts",
    id: cart.id,
    data: updateCart,
    user: user?.id,
  })

  return {
    id: updatedCart.id,
    items: formatCartItems(updatedCart.items),
  }
}

const removeItemFromCartSchema = z.object({
  item: z.uuid("Product line ID must be a valid UUID"),
})

export async function removeItemFromCart(
  input: z.infer<typeof removeItemFromCartSchema>
) {
  const { item } = removeItemFromCartSchema.parse(input)

  const [payload, guestSessionId, user] = await Promise.all([
    getPayload({ config }),
    ensureGuestSessionId(),
    getCurrentUser(),
  ])

  // get the cart
  const { docs: carts } = await payload.find({
    collection: "carts",
    where: {
      or: [
        ...[
          user
            ? {
                user: {
                  equals: user.id,
                },
              }
            : {},
        ],
        {
          guestSessionId: {
            equals: guestSessionId,
          },
        },
      ],
      "items.productLine": {
        equals: item,
      },
    },
  })

  if (carts.length === 0) {
    throw new CartNotFound()
  }

  const cart = carts[0]

  const cartItem = cart.items.find((cartItem) =>
    typeof cartItem.productLine === "string"
      ? cartItem.productLine === item
      : cartItem.productLine.id === item
  )

  if (!cartItem) {
    throw new CartProductNotFoundError([item])
  }

  const updatedItems = cart.items.filter((cartItem) => {
    const productLineId =
      typeof cartItem.productLine === "string"
        ? cartItem.productLine
        : cartItem.productLine.id
    return productLineId !== item
  })

  // If no items remain, throw error... dev should instead delete the cart
  if (updatedItems.length === 0) {
    throw new Error(
      "Cart is empty after removing item. Delete the cart instead."
    )
  }

  const updateCart: Cart = {
    ...cart,
    user: user?.id,
    guestSessionId: guestSessionId ?? undefined,
    lastActiveAt: new Date().toISOString(),
    items: updatedItems,
  }

  const updatedCart = await payload.update({
    collection: "carts",
    id: cart.id,
    data: updateCart,
    user: user?.id,
  })

  return {
    id: updatedCart.id,
    items: formatCartItems(updatedCart.items),
  }
}

export async function deleteCart() {
  const [payload, guestSessionId, user] = await Promise.all([
    getPayload({ config }),
    ensureGuestSessionId(),
    getCurrentUser(),
  ])

  // delete the cart
  const { errors } = await payload.delete({
    collection: "carts",
    where: {
      ...(user
        ? {
            user: {
              equals: user.id,
            },
          }
        : {
            guestSessionId: {
              equals: guestSessionId,
            },
          }),
    },
    depth: 0,
    user: user?.id,
  })

  if (errors && errors.length > 0) {
    throw new Error("Failed to delete cart")
  }

  return null
}
