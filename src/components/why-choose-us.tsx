import Image from 'next/image';

export default function WhyChooseUs() {
  return (
    <section id="about" className="w-full bg-gray-50 py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Why Choose Eurofit?
              </h2>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                In a market flooded with fake products, we stand out by offering genuine
                European fitness supplements at competitive prices.
              </p>
            </div>
            <ul className="grid gap-4">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-100 p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-green-600"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="leading-none font-medium">100% Authentic Products</p>
                  <p className="text-sm text-gray-500">
                    All our products are sourced directly from Europe, ensuring
                    authenticity and quality.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-100 p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-green-600"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="leading-none font-medium">Competitive Pricing</p>
                  <p className="text-sm text-gray-500">
                    We offer the best prices in the market for both retail and wholesale
                    customers.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-100 p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-green-600"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="leading-none font-medium">Reliable Supply Chain</p>
                  <p className="text-sm text-gray-500">
                    With offices in Nairobi and London, we ensure consistent and timely
                    product delivery.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="mx-auto w-full max-w-[500px] lg:max-w-none">
            <Image
              src="/placeholder.svg?height=550&width=550"
              alt="Eurofit Store"
              width={550}
              height={550}
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
