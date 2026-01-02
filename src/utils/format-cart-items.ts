import { CartItem, cartItemSchema } from "@/lib/schemas/cart"
import {
  Cart as PayloadCart,
  ProductLine as PayloadProductLine,
  Product,
} from "@/payload-types"
import { ProductLine } from "@/types"
import z from "zod"
import { formatProductLine } from "./format-product-line"

export function formatCartItems(
  items: Pick<PayloadCart, "items">["items"]
): CartItem[] {
  const formattedItems: CartItem[] = []

  for (const item of items) {
    if (typeof item.productLine !== "object" || item.productLine === null) {
      throw new Error("Expected productLine to be populated object")
    }

    const productLine = item.productLine as PayloadProductLine

    if (
      typeof productLine.product !== "object" ||
      productLine.product === null
    ) {
      throw new Error("Expected productLine.product to be populated object")
    }

    const product = productLine.product as Product

    const formatted = formatProductLine(productLine)

    if (typeof formatted.retailPrice !== "number") {
      throw new Error(
        `Missing price in formatted product line: ${formatted.id}`
      )
    }

    const formattedProductLine: Omit<ProductLine, "isNotifyRequested"> = {
      id: formatted.id,
      sku: formatted.sku,
      title: formatted.title,
      slug: formatted.slug,
      price: formatted.retailPrice,
      variant: formatted.variant,
      stock: formatted.stock > 0 ? formatted.stock : (formatted.srcStock ?? 0),
      isBackorder: formatted.isBackorder,
      isLowStock: formatted.isLowStock,
      isOutOfStock: formatted.isOutOfStock,
    }

    const cartItem = cartItemSchema.parse({
      ...formattedProductLine,
      quantity: item.quantity,
      snapshot: item.snapshot,
      product: {
        id: product.id,
        slug: product.slug,
        title: product.title,
        image: product.srcImage,
      },
    })

    formattedItems.push(cartItem)
  }

  return z.array(cartItemSchema).parse(formattedItems)
}
