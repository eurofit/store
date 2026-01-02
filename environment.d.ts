import 'next';

namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'test' | 'production';
    DATABASE_URI: string;
    PAYLOAD_SECRET: string;
    GMAIL_PASSWORD: string;
    GMAIL: string;
    SMTP_HOST: string;
    SMTP_PORT: number;
    PAYSTACK_SECRET_KEY: string;
    PAYSTACK_PUBLIC_KEY: string;
    SUPABASE_S3_BUCKET: string;
    SUPABASE_S3_ACCESS_KEY_ID: string;
    SUPABASE_S3_SECRET_ACCESS_KEY: string;
    SUPABASE_S3_REGION: string;
    SUPABASE_S3_ENDPOINT: string;
    NEXT_PUBLIC_APP_URL: string;
  }
}
