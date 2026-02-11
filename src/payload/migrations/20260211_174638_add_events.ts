import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_events_type" AS ENUM('brand_viewed', 'product_viewed');
  CREATE TABLE "events" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"type" "enum_events_type" NOT NULL,
  	"time" timestamp(3) with time zone NOT NULL,
  	"user_id" uuid,
  	"session" varchar NOT NULL,
  	"brand_id" uuid,
  	"category_id" uuid,
  	"product_id" uuid,
  	"product_line_id" uuid,
  	"quantity" numeric,
  	"price" numeric,
  	"source" varchar,
  	"device" varchar,
  	"geo_country" varchar,
  	"geo_city" varchar
  );
  
  ALTER TABLE "orders" RENAME COLUMN "address_id" TO "shipping_address_id";
  ALTER TABLE "orders" DROP CONSTRAINT "orders_address_id_addresses_id_fk";
  
  DROP INDEX "orders_address_idx";
  ALTER TABLE "addresses" ALTER COLUMN "user_id" DROP NOT NULL;
  ALTER TABLE "order_statuses" ALTER COLUMN "staff_id" SET NOT NULL;
  ALTER TABLE "users" ADD COLUMN "account_number" numeric NOT NULL;
  ALTER TABLE "orders" ADD COLUMN "billing_address_id" uuid NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "events_id" uuid;
  ALTER TABLE "events" ADD CONSTRAINT "events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_product_line_id_product_lines_id_fk" FOREIGN KEY ("product_line_id") REFERENCES "public"."product_lines"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "events_time_idx" ON "events" USING btree ("time");
  CREATE INDEX "events_user_idx" ON "events" USING btree ("user_id");
  CREATE INDEX "events_brand_idx" ON "events" USING btree ("brand_id");
  CREATE INDEX "events_category_idx" ON "events" USING btree ("category_id");
  CREATE INDEX "events_product_idx" ON "events" USING btree ("product_id");
  CREATE INDEX "events_product_line_idx" ON "events" USING btree ("product_line_id");
  ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_address_id_addresses_id_fk" FOREIGN KEY ("shipping_address_id") REFERENCES "public"."addresses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_billing_address_id_addresses_id_fk" FOREIGN KEY ("billing_address_id") REFERENCES "public"."addresses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_account_number_idx" ON "users" USING btree ("account_number");
  CREATE INDEX "orders_shipping_address_idx" ON "orders" USING btree ("shipping_address_id");
  CREATE INDEX "orders_billing_address_idx" ON "orders" USING btree ("billing_address_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "events" CASCADE;
  ALTER TABLE "orders" DROP CONSTRAINT "orders_shipping_address_id_addresses_id_fk";
  
  ALTER TABLE "orders" DROP CONSTRAINT "orders_billing_address_id_addresses_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_events_fk";
  
  DROP INDEX "users_account_number_idx";
  DROP INDEX "orders_shipping_address_idx";
  DROP INDEX "orders_billing_address_idx";
  DROP INDEX "payload_locked_documents_rels_events_id_idx";
  ALTER TABLE "addresses" ALTER COLUMN "user_id" SET NOT NULL;
  ALTER TABLE "order_statuses" ALTER COLUMN "staff_id" DROP NOT NULL;
  ALTER TABLE "orders" ADD COLUMN "address_id" uuid NOT NULL;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "orders_address_idx" ON "orders" USING btree ("address_id");
  ALTER TABLE "users" DROP COLUMN "account_number";
  ALTER TABLE "orders" DROP COLUMN "shipping_address_id";
  ALTER TABLE "orders" DROP COLUMN "billing_address_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "events_id";
  DROP TYPE "public"."enum_events_type";`)
}
