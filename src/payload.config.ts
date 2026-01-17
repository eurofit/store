import { collections } from '@/collections';
import { users } from '@/collections/users';
import { NAMESPACE } from '@/constants/keys';
import { site } from '@/constants/site';
import { env } from '@/env.mjs';
import { globals } from '@/globals';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import path from 'path';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  serverURL: site.url,
  cookiePrefix: NAMESPACE,
  admin: {
    user: users.slug,
    components: {
      graphics: {
        Logo: '@/components/logo.tsx#Logo',
        Icon: '@/components/payload-icon.tsx#PayloadIcon',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    dateFormat: 'dd MMMM yyyy hh:mm',
    dashboard: {
      widgets: [
        {
          ComponentPath: '@/components/widgets/users-count.tsx#UsersCount',
          slug: 'users-count',
          label: 'Users Count',
        },
      ],
    },
  },
  routes: {
    admin: '/dashboard',
    api: '/payload/api',
    graphQL: '/payload/graphql',
    graphQLPlayground: '/payload/graphql-playground',
  },
  globals,
  collections,
  jobs: {
    // tasks,
  },
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: env.DATABASE_URI,
    },
    idType: 'uuid',
    allowIDOnCreate: true,
  }),

  email: nodemailerAdapter({
    defaultFromAddress: env.GMAIL,
    defaultFromName: site.name,
    transportOptions: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: {
        user: env.GMAIL,
        pass: env.GMAIL_PASSWORD,
      },
    },
  }),
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        },
      },
      bucket: env.SUPABASE_S3_BUCKET,
      config: {
        forcePathStyle: true,
        credentials: {
          accessKeyId: env.SUPABASE_S3_ACCESS_KEY_ID,
          secretAccessKey: env.SUPABASE_S3_SECRET_ACCESS_KEY,
        },
        region: env.SUPABASE_S3_REGION,
        endpoint: env.SUPABASE_S3_ENDPOINT,
      },
    }),

    nestedDocsPlugin({
      collections: ['categories'],
      generateLabel: (_, doc) => String(doc.title ?? ''),
      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),
  ],
  sharp,
});
