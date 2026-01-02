import { env } from "@/env.mjs"
import config from "@/payload.config"
import { NextResponse } from "next/server"
import crypto from "node:crypto"
import { getPayload } from "payload"

const secret = env.PAYSTACK_SECRET_KEY

export async function POST(req: Request) {
  const body = await req.json()

  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(body))
    .digest("hex")

  const signature = req.headers.get("x-paystack-signature")

  if (hash != signature) {
    return Response.json(
      {
        success: false,
      },
      {
        status: 401,
      }
    )
  }

  const payload = await getPayload({
    config,
  })

  if ((body.event = "charge.success")) {
    payload.create({
      collection: "transactions",
      data: {
        order: body.data.reference,
        ref: body.data.reference,
        amount: body.data.amount / 100,
        provider: "paystack",
      },
      draft: false,
    })
  }

  return NextResponse.json(
    {
      success: true,
    },
    {
      status: 200,
    }
  )
}
