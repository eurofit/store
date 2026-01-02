import { Heading } from "@/components/typography"
import Image from "next/image"
import Link from "next/link"

type ThankYouPageProps = {
  params: Promise<{
    orderId: string
  }>
}

export default async function ThankYouPage({ params }: ThankYouPageProps) {
  const { orderId } = await params
  // const user = await getCurrentUser();

  // if (!user) notFound();

  // const payload = await getPayload({
  //   config,
  // });

  // const order = await payload.findByID({
  //   collection: 'orders',
  //   id: params.orderId,
  //   overrideAccess: false,
  //   user,
  // });

  // if (!order) notFound();

  return (
    <main className="flex items-center justify-center text-center">
      <div className="flex max-w-sm flex-col items-center justify-center gap-4">
        <div className="text-muted-foreground relative mb-6 flex size-32 items-center justify-center md:size-44">
          <Image src="/illustrations/verified.svg" fill alt="Verified" />
        </div>
        <hgroup className="space-y-2">
          <Heading className="font-bold">Thank You for Your Order!</Heading>
          <p className="text-muted-foreground">
            Your order has been received and is being processed.
          </p>
          <Link href={"/orders/" + orderId}>See your order</Link>
        </hgroup>
      </div>
    </main>
  )
}
