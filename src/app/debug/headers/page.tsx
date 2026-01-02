import { headers } from "next/headers"

export default async function HeadersPage() {
  const h = await headers()

  const allHeaders = Array.from(h.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  )

  return (
    <main style={{ padding: 24 }}>
      <h1>Request Headers</h1>

      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
        {JSON.stringify(Object.fromEntries(allHeaders), null, 2)}
      </pre>
    </main>
  )
}
