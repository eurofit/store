import { Thing, WithContext } from 'schema-dts';

type JsonLdProps = {
  jsonLd: WithContext<Thing> | WithContext<Thing>[];
};

export function JsonLd({ jsonLd }: JsonLdProps) {
  if (Array.isArray(jsonLd)) {
    return (
      <>
        {jsonLd.map((item, index) => (
          <script
            key={index}
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
