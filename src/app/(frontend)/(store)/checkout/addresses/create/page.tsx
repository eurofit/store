import { getCurrentUser } from "@/actions/auth/get-current-user"
import { headers as getHeaders } from "next/headers"
import { AddressForm } from "./address-form"

export default async function CheckoutAddressPage() {
  const user = await getCurrentUser()
  const headers = await getHeaders()

  const city = headers.get("x-vercel-ip-city")

  return <AddressForm user={user} city={city} />
}
