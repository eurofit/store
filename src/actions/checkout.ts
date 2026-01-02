"use server"

import { site } from "@/constants/site"
import { addressWithIdSchema } from "@/lib/schemas/address"
import { orderSchema } from "@/lib/schemas/order"
import { Order } from "@/payload-types"
import config from "@/payload.config"
import { paystack } from "@/paystact"
import { getPayload } from "payload"
import * as z from "zod"
import { getCurrentUser } from "./auth/get-current-user"

const checkoutSchema = orderSchema
  .pick({
    items: true,
  })
  .extend({
    addressId: z.uuid("Address ID must be a valid UUID"),
  })

type CheckoutArgs = z.infer<typeof checkoutSchema>

export async function checkout(unSafeData: CheckoutArgs) {
  const { items, addressId } = checkoutSchema.parse(unSafeData)
  const orderItems: Order["items"] = items.map(({ id, ...item }) => ({
    productLine: id,
    ...item,
  }))

  const [payload, user] = await Promise.all([
    getPayload({ config }),
    getCurrentUser(),
  ])

  if (!user) {
    throw new Error("User must be authenticated to checkout")
  }
  // verify address ownership
  const { docs: addresses } = await payload.find({
    collection: "addresses",
    where: {
      id: { equals: addressId },
      user: { equals: user.id },
    },
    user,
    limit: 1,
    depth: 0,
    pagination: false,
  })

  const address = addresses[0]

  if (!address) {
    throw new Error("Address not found or does not belong to the user")
  }

  //This is done in: before change hook
  // verify stock availability
  // verify items price

  // proceed to create order
  const order = await payload.create({
    collection: "orders",
    data: {
      orderIdNumber: -1,
      customer: user.id,
      address: address.id,
      items: orderItems,
      status: "pending",
      paymentStatus: "unpaid",
      snapshot: {
        user: {
          id: user.id,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
        address: addressWithIdSchema.parse(address),
      },
    },
    draft: false,
  })

  // check order total amount
  if (!order.total) throw new Error("Order total is missing")

  // init paystack

  const res = await paystack.transaction.initialize({
    reference: order.orderIdNumber.toString(),
    email: user.email,
    // convert to cents
    amount: (order.total * 100).toString(),
    callback_url: site.url + "/thank-you/" + order.orderIdNumber,
    metadata: {
      cancel_action: site.url + "/checkout",
      order_id: order.id,
      snapshot: {
        items: items,
        user: {
          id: user.id,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
        address: addressWithIdSchema.parse(address),
      },
    },
  })

  if ("data" in res && res.data === null) {
    throw new Error("Failed to initialize payment")
  }

  return res
}
