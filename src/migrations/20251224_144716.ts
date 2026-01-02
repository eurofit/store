import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "transactions" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"order_id" uuid NOT NULL,
  	"amount" numeric NOT NULL,
  	"ref" varchar NOT NULL,
  	"provider" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users" ALTER COLUMN "paystack_customer_code" SET NOT NULL;
  ALTER TABLE "order_statuses" ALTER COLUMN "staff_id" DROP NOT NULL;
  ALTER TABLE "orders" ADD COLUMN "snapshot" jsonb NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "transactions_id" uuid;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "transactions_order_idx" ON "transactions" USING btree ("order_id");
  CREATE INDEX "transactions_updated_at_idx" ON "transactions" USING btree ("updated_at");
  CREATE INDEX "transactions_created_at_idx" ON "transactions" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_transactions_fk" FOREIGN KEY ("transactions_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_transactions_id_idx" ON "payload_locked_documents_rels" USING btree ("transactions_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "transactions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "transactions" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_transactions_fk";
  
  DROP INDEX "payload_locked_documents_rels_transactions_id_idx";
  ALTER TABLE "users" ALTER COLUMN "paystack_customer_code" DROP NOT NULL;
  ALTER TABLE "order_statuses" ALTER COLUMN "staff_id" SET NOT NULL;
  ALTER TABLE "orders" DROP COLUMN "snapshot";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "transactions_id";`);
}
