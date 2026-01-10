import { dmSans } from "@/app/fonts/dm-sans"
import { montserrat } from "@/app/fonts/montserrat"
import "@/app/globals.css"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { Toaster } from "@/components/ui/sonner"
import { site } from "@/constants/site"
import { JotaiProvider } from "@/providers/jotai"
import { ReactQueryProvider } from "@/providers/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import type { Metadata, Viewport } from "next"
import NextTopLoader from "nextjs-toploader"

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s - ${site.name}`,
  },
  description: site.description,
  other: {
    "apple-mobile-web-app-title": site.name,
  },
}

export const viewport: Viewport = {
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${montserrat.variable} antialiased`}>
        <TailwindIndicator />
        <Toaster richColors duration={8000} closeButton />
        <NextTopLoader
          showSpinner={false}
          color="#fb2c36"
          height={4}
          crawlSpeed={200}
          easing="ease"
          shadow="0 0 10px rgba(0, 0, 0, 0.1)"
          zIndex={9999}
          initialPosition={0.08}
          speed={200}
        />
        <JotaiProvider>
          <ReactQueryProvider>
            <ReactQueryDevtools initialIsOpen={false} />
            {children}
          </ReactQueryProvider>
        </JotaiProvider>
      </body>
    </html>
  )
}
