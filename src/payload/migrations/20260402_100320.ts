import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "users_middle_name_idx";
  ALTER TABLE "addresses" ADD COLUMN "secondary_phone" varchar;
  ALTER TABLE "addresses" ADD COLUMN "area" varchar;
  ALTER TABLE "addresses" ADD COLUMN "landmark" varchar;
  ALTER TABLE "orders" ADD COLUMN "paystack_access_code" varchar;
  ALTER TABLE "transactions" ADD COLUMN "is_test" boolean DEFAULT false;
  ALTER TABLE "transactions" ADD COLUMN "paid_at" timestamp(3) with time zone NOT NULL;
  ALTER TABLE "transactions" ADD COLUMN "snapshot" jsonb NOT NULL;
  ALTER TABLE "users" DROP COLUMN "middle_name";
  ALTER TABLE "addresses" DROP COLUMN "email";
  ALTER TABLE "addresses" DROP COLUMN "line3";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN "middle_name" varchar;
  ALTER TABLE "addresses" ADD COLUMN "email" varchar NOT NULL;
  ALTER TABLE "addresses" ADD COLUMN "line3" varchar;
  CREATE INDEX "users_middle_name_idx" ON "users" USING btree ("middle_name");
  ALTER TABLE "addresses" DROP COLUMN "secondary_phone";
  ALTER TABLE "addresses" DROP COLUMN "area";
  ALTER TABLE "addresses" DROP COLUMN "landmark";
  ALTER TABLE "orders" DROP COLUMN "paystack_access_code";
  ALTER TABLE "transactions" DROP COLUMN "is_test";
  ALTER TABLE "transactions" DROP COLUMN "paid_at";
  ALTER TABLE "transactions" DROP COLUMN "snapshot";`)
}
