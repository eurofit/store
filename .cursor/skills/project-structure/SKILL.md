---
name: project-structure
description: Codebase project structure conventions, folder patterns, tech stack, and file naming rules. Use when creating new files, adding features, refactoring, or deciding where code should live. Triggers on questions about project layout, file placement, or naming conventions.
---

# Project Structure

## Tech Stack

- **Framework**: Next.js 16 (canary) with App Router
- **CMS**: Payload CMS v3 (embedded, not standalone)
- **Database**: PostgreSQL via `@payloadcms/db-postgres` backed by Supabase
- **Storage**: S3 via `@payloadcms/storage-s3` backed by Supabase
- **Styling**: Tailwind CSS v4 + shadcn/ui (radix-nova style)
- **State**: Jotai (atoms) + React Query
- **Forms**: React Hook Form + Zod v4
- **Payments**: Paystack
- **PDF**: `@react-pdf/renderer`
- **Email**: `@react-email/components` + Nodemailer
- **Package manager**: pnpm
- **Language**: TypeScript (strict)

## Naming Conventions

- **All files and directories**: kebab-case, lowercase. Examples: `product-card.tsx`, `use-cart.tsx`, `get-brand-filters.ts`.
- **Route segments**: Next.js conventions — `[slug]`, `[[...segments]]`, `(group-name)`.
- **Collection folders**: Match their Payload slug — `product-lines/`, `stock-alerts/`.
- **Hooks**: Prefixed with `use-` — `use-cart.tsx`, `use-mobile.ts`.
- **Barrel exports**: `index.ts` for collections, globals, and multi-file modules.
- **Constants, schemas, utils**: Plain `.ts`. Only use `.tsx` when the file contains JSX.

## Folder Structure Patterns

- **Route groups** `(frontend)`, `(store)`, `(plain)`, `(payload)` separate layout concerns without affecting URL paths.
- `(store)` wraps pages with full store chrome (header, footer, announce bar).
- `(plain)` provides a minimal passthrough layout for auth pages.
- **Server actions** in `src/actions/` are the primary data layer, grouped by domain (auth, products, brands, categories, search).
- **Payload collections** in `src/payload/collections/` are co-located with their `hooks/` and `fields/` subdirectories.
- **Atoms** in `src/atoms/` define Jotai state slices.
- **Components** follow a flat-first structure: `src/components/ui/` holds primitives, domain folders (`orders/`, `searchbar/`, `cart/`, `auth/`) group complex features, and top-level files are standalone feature components.
- **PDF** and **emails** are isolated modules with their own components/templates.

## Directory Tree

```

src/
├── app/
│ ├── (frontend)/
│ │ ├── layout.tsx # Root frontend layout (fonts, providers, JSON-LD)
│ │ ├── (store)/ # Store layout (header + footer + announce bar)
│ │ │ ├── layout.tsx
│ │ │ ├── page.tsx # Homepage
│ │ │ ├── products/[slug]/page.tsx
│ │ │ ├── brands/[brandSlug]/page.tsx
│ │ │ ├── categories/[categorySlug]/page.tsx
│ │ │ ├── search/page.tsx
│ │ │ ├── checkout/ # Checkout flow
│ │ │ │ ├── addresses/create/
│ │ │ │ ├── checkout-content.tsx
│ │ │ │ ├── checkout-item.tsx
│ │ │ │ └── layout.tsx
│ │ │ ├── orders/[id]/page.tsx
│ │ │ ├── thank-you/[orderId]/page.tsx
│ │ │ ├── account/ # User account
│ │ │ │ ├── addresses/page.tsx
│ │ │ │ ├── orders/page.tsx
│ │ │ │ ├── stock-alerts/page.tsx
│ │ │ │ ├── wishlist/page.tsx
│ │ │ │ ├── form.tsx
│ │ │ │ ├── sidebar.tsx
│ │ │ │ └── layout.tsx
│ │ │ ├── contact-us/page.tsx
│ │ │ ├── reset-password/page.tsx
│ │ │ └── verify/page.tsx
│ │ └── (plain)/ # Minimal layout (no store chrome)
│ │ ├── layout.tsx
│ │ ├── login/page.tsx
│ │ └── forgot-password/page.tsx
│ │
│ ├── (payload)/ # Payload CMS admin
│ │ ├── admin/[[...segments]]/ # Admin dashboard (catch-all)
│ │ ├── payload/api/[...slug]/ # REST API
│ │ ├── payload/api/graphql/ # GraphQL endpoint
│ │ ├── custom.css
│ │ └── layout.tsx
│ │
│ ├── api/webhooks/paystack/route.ts # Payment webhook
│ ├── globals.css
│ ├── sitemap.ts
│ ├── robots.ts
│ ├── manifest.ts
│ └── loading.tsx
│
├── actions/ # Server actions (data layer)
│ ├── auth/ # login, logout, verify, forgot/reset password
│ ├── products/ # get, search, get-by-slug
│ ├── brands/ # get, filters, sitemap
│ ├── categories/ # get, filters, sitemap
│ ├── search/ # suggestions, brand search, filters
│ ├── product-lines/
│ ├── cart.ts
│ ├── checkout.ts
│ ├── orders.ts
│ ├── address.ts
│ ├── contact.ts
│ ├── notify-me.ts
│ ├── get-nav.ts
│ └── ensure-guest-session-id.ts
│
├── atoms/ # Jotai state atoms
│ ├── cart.ts
│ ├── user.ts
│ └── search-bar.ts
│
├── components/ # Shared React components
│ ├── ui/ # Primitives (button, input, dialog, etc.)
│ ├── auth/ # login-button, user-button
│ ├── cart/ # Cart drawer and items
│ ├── icons/ # Social media icons
│ ├── orders/table/ # Orders table with cell renderers
│ ├── searchbar/ # Search input, results, suggestions
│ ├── cards/ # Card variants
│ ├── forms/ # Form components
│ ├── widgets/ # Payload dashboard widgets
│ └── .tsx # Standalone feature components
│
├── constants/ # App-wide constants
│ ├── site.tsx
│ ├── keys.ts
│ ├── base-url.ts
│ ├── roles.ts
│ ├── orders.ts
│ ├── invoice.ts
│ ├── payment-terms.ts
│ ├── shipment-methods.ts
│ ├── titles.ts
│ └── json-ld.ts
│
├── fonts/ # Next.js font declarations
│ ├── dm-sans.ts
│ └── montserrat.ts
│
├── hooks/ # Custom React hooks
│ ├── use-cart.tsx
│ ├── use-checkout.ts
│ ├── use-stock-alert.ts
│ ├── use-mobile.ts
│ ├── use-in-view.ts
│ ├── use-toggle.ts
│ ├── use-prevent-scroll.ts
│ └── use-mounted.ts
│
├── payload/ # Payload CMS configuration
│ ├── config.ts # buildConfig() entry
│ ├── collections/
│ │ ├── index.ts # Barrel export
│ │ ├── users/ (hooks/)
│ │ ├── products/ (hooks/)
│ │ ├── product-lines/ (hooks/)
│ │ ├── inventory/ (fields/, hooks/)
│ │ ├── brands/ (hooks/)
│ │ ├── categories/ (hooks/)
│ │ ├── orders/ (hooks/)
│ │ ├── carts/ (hooks/)
│ │ ├── addresses/ (hooks/)
│ │ ├── transactions/ (hooks/)
│ │ ├── stock-alerts/ (hooks/)
│ │ └── media.ts
│ ├── globals/ # Global configs (nav)
│ ├── fields/ # Reusable Payload field definitions
│ ├── hooks/ # Shared Payload hooks (auto-increment)
│ ├── migrations/
│ ├── tasks/
│ ├── sdk.ts # Payload SDK client
│ ├── types.ts # Generated types
│ └── generated-schema.ts
│
├── pdf/ # PDF generation
│ ├── invoice/ # doc, styles, fonts, data, types
│ └── components/ # PDF viewer, barcode
│
├── emails/ # Email templates (react-email)
│ ├── forgot-password.tsx
│ ├── verification.tsx
│ └── layout.tsx
│
├── providers/ # Context providers
│ ├── jotai.tsx
│ └── react-query.tsx
│
├── schemas/ # Zod validation schemas
│ ├── cart.ts
│ ├── order.ts
│ ├── address.ts
│ ├── login.ts
│ ├── contact.ts
│ ├── reset-password.ts
│ ├── safe-user.ts
│ └── paystack-customer-code.ts
│
├── types/
│ └── index.ts
│
├── utils/ # Utility functions
│ ├── cn.ts
│ ├── slugify.ts
│ ├── capitalize.ts
│ ├── math.ts
│ ├── exist.ts
│ ├── format-with-commas.ts
│ ├── format-cart-items.ts
│ ├── format-product-line.ts
│ ├── build-wa-link.ts
│ ├── build-prefix-ts-query.ts
│ ├── safe-user.ts
│ ├── brand/
│ └── json-ld/
│
├── env.mjs # Type-safe env (t3-env)
├── paystack.ts # Paystack client
└── proxy.ts # Middleware (headers, guest session)

```

## File Placement Rules

| Creating a...           | Place it in                             |
| ----------------------- | --------------------------------------- |
| React hook              | `src/hooks/use-*.ts(x)`                 |
| Pure utility function   | `src/utils/`                            |
| Zod validation schema   | `src/schemas/`                          |
| Jotai atom              | `src/atoms/`                            |
| Server action           | `src/actions/{domain}/`                 |
| Payload collection      | `src/payload/collections/{name}/`       |
| Payload collection hook | `src/payload/collections/{name}/hooks/` |
| Payload reusable field  | `src/payload/fields/`                   |
| UI primitive (shadcn)   | `src/components/ui/`                    |
| Feature component       | `src/components/`                       |
| Domain component group  | `src/components/{domain}/`              |
| App-wide constant       | `src/constants/`                        |
| Email template          | `src/emails/`                           |
| Font declaration        | `src/fonts/`                            |
| TypeScript type         | `src/types/`                            |
