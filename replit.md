# Little Village Restaurant Web App

## Overview

Full-stack restaurant web application for Little Village Restaurant, Mangalagiri, Andhra Pradesh.

## Business Details

- **Restaurant**: Little Village Restaurant
- **Tagline**: "Traditional provisions are dished up in this spacious, unpretentious restaurant."
- **Address**: Service Road, Mangalagiri, Chinnakakani, Andhra Pradesh 522508, India
- **Phone/WhatsApp**: 090100 38444 (+919010038444)
- **Restaurant ID**: `little-village` (SaaS-ready multi-tenant system)

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite, Tailwind CSS, Framer Motion
- **API framework**: Express 5 with express-session
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── little-village/     # React + Vite frontend (served at /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
└── scripts/                # Utility scripts
```

## Admin Access

- **URL**: `/admin/login`
- **Email**: `admin@littlevillage.com`
- **Password**: `admin123`

## Pages

### Public
- `/` - Home (hero, about, featured dishes, testimonials, services, map)
- `/menu` - Menu with categories, search, filter, add to cart
- `/order` - Cart, checkout, WhatsApp ordering
- `/reservations` - Table reservation form
- `/contact` - Contact info, map, contact form

### Admin
- `/admin/login` - Admin login
- `/admin/dashboard` - Stats overview
- `/admin/menu` - Menu CRUD management
- `/admin/orders` - Order status management
- `/admin/reservations` - Reservation management

## API Routes

- `GET /api/menu` - Get menu items (with restaurantId, category filters)
- `POST /api/menu` - Create menu item (admin)
- `PUT /api/menu/:id` - Update menu item (admin)
- `DELETE /api/menu/:id` - Delete menu item (admin)
- `GET /api/orders` - Get orders (admin)
- `POST /api/orders` - Create order (public)
- `PUT /api/orders/:id` - Update order status (admin)
- `GET /api/reservations` - Get reservations (admin)
- `POST /api/reservations` - Create reservation (public)
- `PUT /api/reservations/:id` - Update reservation status (admin)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Check admin session
- `POST /api/admin/logout` - Admin logout
- `GET /api/stats` - Dashboard stats (admin)

## Database Schema

Tables: `menu_items`, `orders`, `reservations`, `admin_users`
All tables include `restaurant_id` for SaaS multi-tenancy.

## WhatsApp Integration

Orders generate WhatsApp messages to `+919010038444`:
`https://wa.me/919010038444?text=<encoded_order_details>`
