# XpresaT Monorepo

Este es el repositorio del proyecto **XpresaT**, estructurado como un monorepo usando Turborepo y pnpm workspaces.

## Estructura del Proyecto

*   **`apps/web`**: Aplicación de frontend desarrollada con **Astro**.
*   **`apps/cms`**: Panel de administración y API desarrollado con **Payload CMS (v3)** y Next.js.

---

## Credenciales del CMS

### Usuario Administrador por Defecto
En el script de seeding de la base de datos (`seed.ts`), las credenciales del usuario administrador por defecto son:
*   **Usuario/Email:** `admin@xpresat.com`
*   **Contraseña:** `adminpassword123`

### Usuario de Pruebas E2E (Playwright)
Si estás ejecutando las pruebas E2E, las credenciales del usuario temporal en `seedUser.ts` son:
*   **Usuario/Email:** `dev@payloadcms.com`
*   **Contraseña:** `test`

---

## Desarrollo Local

1. Instala las dependencias desde la raíz:
   ```bash
   pnpm install
   ```

2. Configura las variables de entorno para el CMS:
   Copia el archivo `.env.example` en `apps/cms/.env` y asegúrate de configurar tu `DATABASE_URL` y `PAYLOAD_SECRET`.

3. Inicia todos los servicios en modo desarrollo:
   ```bash
   pnpm dev
   ```
