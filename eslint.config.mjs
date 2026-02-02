import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextCoreWebVitals,
  {
    ignores: [
      'node_modules/**',
      // Payload-generated files (handled by Payload generators)
      'src/payload/generated-schema.ts',
      'src/payload/types.ts',
      // .next directory
      '.next/**',
    ],
  },
];

export default config;
