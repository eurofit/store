// @ts-check
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    DATABASE_URI: z.string().min(1),
    PAYLOAD_CONFIG_PATH: z.string().min(1),
    PAYLOAD_SECRET: z.string().min(1),
    SMTP_USERNAME: z.email(),
    SMTP_PASSWORD: z.string().min(1),
    SMTP_INFO_USERNAME: z.email(),
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z
      .string()
      .min(1)
      .transform((val) => +val),
    PAYSTACK_SECRET_KEY: z.string().min(1),
    PAYSTACK_PUBLIC_KEY: z.string().min(1),
    SUPABASE_S3_BUCKET: z.string().min(1),
    SUPABASE_S3_ACCESS_KEY_ID: z.string().min(1),
    SUPABASE_S3_SECRET_ACCESS_KEY: z.string().min(1),
    SUPABASE_S3_REGION: z.string().min(1),
    SUPABASE_S3_ENDPOINT: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    DATABASE_URI: process.env.DATABASE_URI,
    PAYLOAD_CONFIG_PATH: process.env.PAYLOAD_CONFIG_PATH,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_INFO_USERNAME: process.env.SMTP_INFO_USERNAME,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
    PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY,
    SUPABASE_S3_BUCKET: process.env.SUPABASE_S3_BUCKET,
    SUPABASE_S3_ACCESS_KEY_ID: process.env.SUPABASE_S3_ACCESS_KEY_ID,
    SUPABASE_S3_SECRET_ACCESS_KEY: process.env.SUPABASE_S3_SECRET_ACCESS_KEY,
    SUPABASE_S3_REGION: process.env.SUPABASE_S3_REGION,
    SUPABASE_S3_ENDPOINT: process.env.SUPABASE_S3_ENDPOINT,
  },
});

const vercelHost =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    : process.env.NEXT_PUBLIC_VERCEL_URL;
const vercelUrl = vercelHost ? `https://${vercelHost}` : undefined;
const publicUrl = process.env.NEXT_PUBLIC_APP_URL || vercelUrl;

if (!publicUrl) {
  throw new Error('Missing NEXT_PUBLIC_APP_URL or NEXT_PUBLIC_VERCEL_URL variables!');
}

// force type inference to string
const _publicUrl = publicUrl;
export { _publicUrl as publicUrl };
