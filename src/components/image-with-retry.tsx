"use client"

import Image from "next/image"
import { useState } from "react"

type ImageProps = React.ComponentProps<typeof Image> & {
  retryCount?: number
  asChild?: boolean
}

export function ImageWithRetry({
  retryCount = 3,
  asChild = false,
  ...props
}: ImageProps) {
  const [errorCount, setErrorCount] = useState(0)

  const handleError = () => {
    if (errorCount < retryCount) {
      setErrorCount((prev) => prev + 1)
    }
  }

  return (
    <Image
      key={`${props.src}?retry=${errorCount}`}
      onError={handleError}
      {...props}
    />
  )
}
