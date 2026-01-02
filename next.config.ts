import { withPayload } from "@payloadcms/next/withPayload"
import { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.tropicanawholesale.com",
      },
    ],
  },
}

export default withPayload(nextConfig)
