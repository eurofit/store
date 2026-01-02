import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" ADD COLUMN "order_id_number" numeric NOT NULL;
  ALTER TABLE "order_statuses" ADD COLUMN "visible_to_customer" boolean DEFAULT true NOT NULL;
  CREATE UNIQUE INDEX "orders_order_id_number_idx" ON "orders" USING btree ("order_id_number");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "orders_order_id_number_idx";
  ALTER TABLE "orders" DROP COLUMN "order_id_number";
  ALTER TABLE "order_statuses" DROP COLUMN "visible_to_customer";`);
}
