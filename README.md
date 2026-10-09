# sj-factura-simple

Facturación electrónica simple para monotributistas y pequeños contribuyentes de San Juan, pensada para venderse a través de estudios contables.

**Por qué ahora:** Desde el 1/11/2026 ARCA obliga a emitir comprobantes electrónicos a nuevos grupos de pequeños contribuyentes (RG 5893/2026), con una segunda etapa en marzo de 2027.

## Estado

| Etapa | Qué hay |
| --- | --- |
| Base (actual) | Estructura estándar, base de datos lista, reglas de negocio en `src/lib/facturacion.ts` con tests (validación de CUIT, tipo de comprobante (A/B/C), totales con IVA en centavos y umbral de identificación del consumidor final). |
| Prototipo funcional (siguiente) | Pantallas de carga y consulta sobre la base. |
| Producción | Login, varias cuentas, deploy. |

## Requisitos

- Node.js 20.9 o superior.
- Nada más para desarrollo: la base es un Postgres embebido (PGlite) en `./.data`.

## Empezar

```bash
npm install
cp .env.example .env.local   # opcional en desarrollo
npm run dev                  # prepara la base y abre http://localhost:3000
```

## Scripts

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Prepara la base y levanta el servidor de desarrollo |
| `npm run build` | Compilación de producción |
| `npm start` | Sirve la compilación de producción |
| `npm test` | Tests de las reglas de negocio (Vitest) |
| `npm run lint` / `npm run typecheck` | Calidad de código |
| `npm run check` | Typecheck + lint + tests juntos |
| `npm run db:generate` | Genera una migración SQL después de cambiar `src/db/schema.ts` |
| `npm run db:setup` | Aplica las migraciones |

## Estructura

```
src/
  app/          Pantallas y acciones del servidor
  db/           Esquema (schema.ts) y conexión (index.ts)
  lib/facturacion.ts  Reglas de negocio + tests
drizzle/        Migraciones SQL
scripts/        Setup de base
```

## Producción

Definí `DATABASE_URL` con un Postgres real (Supabase, Neon…), corré `npm run db:setup` y desplegá (por ejemplo en Vercel).

## Próximos pasos

1. Alta de clientes y emisión de comprobantes (borrador, sin enviar a ARCA).
2. Panel para estudios contables: varios contribuyentes por cuenta.
3. Integración real con los web services de ARCA (requiere certificado digital de cada contribuyente).

Estructura compartida con `sj-proveedores-mineros`, `sj-factura-simple`, `sj-alquileres` y `sj-reservas-turismo`.
