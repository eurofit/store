import Script from 'next/script';
import { Thing, WithContext } from 'schema-dts';

type JsonLdProps = {
  jsonLd: WithContext<Thing> | WithContext<Thing>[];
} & React.ComponentProps<typeof Script>;

export function JsonLd({ jsonLd }: JsonLdProps) {
  if (Array.isArray(jsonLd)) {
    return (
      <>
        {jsonLd.map((item, index) => (
          <Script
            id={`json-ld-${index}`}
            key={`json-ld-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
          />
        ))}
      </>
    );
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
