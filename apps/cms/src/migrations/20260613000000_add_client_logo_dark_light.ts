import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "landing_page_clients"
      DROP CONSTRAINT IF EXISTS "landing_page_clients_client_logo_id_media_id_fk",
      DROP COLUMN IF EXISTS "client_logo_id",
      ADD COLUMN "client_logo_dark_id" integer,
      ADD COLUMN "client_logo_light_id" integer;

    ALTER TABLE "landing_page_clients"
      ADD CONSTRAINT "landing_page_clients_client_logo_dark_id_media_id_fk"
        FOREIGN KEY ("client_logo_dark_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION,
      ADD CONSTRAINT "landing_page_clients_client_logo_light_id_media_id_fk"
        FOREIGN KEY ("client_logo_light_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "landing_page_clients"
      DROP CONSTRAINT IF EXISTS "landing_page_clients_client_logo_dark_id_media_id_fk",
      DROP CONSTRAINT IF EXISTS "landing_page_clients_client_logo_light_id_media_id_fk",
      DROP COLUMN IF EXISTS "client_logo_dark_id",
      DROP COLUMN IF EXISTS "client_logo_light_id",
      ADD COLUMN "client_logo_id" integer;

    ALTER TABLE "landing_page_clients"
      ADD CONSTRAINT "landing_page_clients_client_logo_id_media_id_fk"
        FOREIGN KEY ("client_logo_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
  `)
}
