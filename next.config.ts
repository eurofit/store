import { withPayload } from "@payloadcms/next/withPayload"
import { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.tropicanawholesale.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default withPayload(nextConfig)
