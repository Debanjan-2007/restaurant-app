# 🍽️ Little Village Restaurant

> Traditional provisions are dished up in this spacious, unpretentious restaurant.

A full-stack, production-ready restaurant web application built with React + Vite (frontend) and Express + PostgreSQL (backend).

---

## 📍 Business Details

- **Restaurant**: Little Village Restaurant
- **Address**: Service Road, Mangalagiri, Chinnakakani, Andhra Pradesh 522508, India
- **Phone / WhatsApp**: +91 90100 38444

---

## 🚀 Features

### Customer-Facing
- **Home Page** — Hero section, featured dishes, testimonials, services, Google Map
- **Menu Page** — Browse all dishes by category, search, filter, add to cart
- **Order Page** — Cart management, checkout form, WhatsApp-based ordering
- **Reservations** — Table booking form stored in database
- **Contact Page** — Address, phone, embedded map, contact form
- **Dark Mode** — Full dark mode support
- **PWA Ready** — Installable, offline-capable
- **SEO Optimised** — Meta tags, Open Graph tags on every page

### Admin Dashboard (`/admin`)
- **Login** — Secure session-based authentication
- **Dashboard** — Stats: total orders, reservations, revenue estimate, popular items
- **Menu Management** — Add / Edit / Delete menu items with price, image, category, availability
- **Order Management** — View orders, update status (pending → preparing → ready → delivered), send WhatsApp confirmation to customer
- **Reservation Management** — View bookings, confirm or cancel

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| UI Components | shadcn/ui |
| State / Data | TanStack React Query, Zustand (cart) |
| Forms | React Hook Form + Zod |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL + Drizzle ORM |
| Auth | express-session (cookie-based) |
| API Contract | OpenAPI 3.1 + Orval codegen |
| Package Manager | pnpm workspaces (monorepo) |

---

## 📦 Project Structure

```
restaurant-app/
├── artifacts/
│   ├── api-server/          # Express API backend
│   └── little-village/      # React + Vite frontend
├── lib/
│   ├── api-spec/            # OpenAPI spec (openapi.yaml) + Orval codegen
│   ├── api-client-react/    # Generated React Query hooks
│   ├── api-zod/             # Generated Zod validation schemas
│   └── db/                  # Drizzle ORM schema + DB connection
├── scripts/                 # Utility scripts (seed, etc.)
└── pnpm-workspace.yaml
```

---

## ⚙️ Setup & Running

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)
- PostgreSQL database (or use Replit's built-in DB)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Environment Variables
Create a `.env` or set these in your environment:
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
SESSION_SECRET=your-secret-key
PORT=8080
```

### 3. Push Database Schema
```bash
pnpm --filter @workspace/db run push
```

### 4. Seed the Database
```bash
# Run the seed script (requires DATABASE_URL)
pnpm --filter @workspace/scripts run seed
```

### 5. Start Development Servers
```bash
# Start API server
pnpm --filter @workspace/api-server run dev

# Start frontend (in another terminal)
pnpm --filter @workspace/little-village run dev
```

---

## 🔐 Admin Access

| Field | Value |
|-------|-------|
| URL | `/admin/login` |
| Email | `admin@littlevillage.com` |
| Password | `admin123` |

> ⚠️ Change the admin password after first login in production.

---

## 📲 WhatsApp Integration

When a customer places an order:
1. Order is saved to the database
2. Customer is redirected to WhatsApp with a pre-filled order message sent to **+919010038444**

When admin updates order status:
1. Admin clicks **Send** button next to any order
2. A pre-formatted WhatsApp message is sent to the **customer's phone** with order confirmation details

---

## 🗄️ Database Schema

| Table | Description |
|-------|-------------|
| `menu_items` | Restaurant menu with category, price, image, availability |
| `orders` | Customer orders with items, total, status |
| `reservations` | Table bookings with date, time, guest count |
| `admin_users` | Admin accounts (restaurantId, email, passwordHash) |

All tables include `restaurant_id` for SaaS multi-tenancy support.

---

## 🌐 API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/menu` | Get menu items |
| POST | `/api/menu` | Create menu item (admin) |
| PUT | `/api/menu/:id` | Update menu item (admin) |
| DELETE | `/api/menu/:id` | Delete menu item (admin) |
| GET | `/api/orders` | Get all orders (admin) |
| POST | `/api/orders` | Place a new order |
| PUT | `/api/orders/:id` | Update order status (admin) |
| GET | `/api/reservations` | Get reservations (admin) |
| POST | `/api/reservations` | Book a table |
| PUT | `/api/reservations/:id` | Update reservation status (admin) |
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/me` | Get current session |
| POST | `/api/admin/logout` | Admin logout |
| GET | `/api/stats` | Dashboard statistics (admin) |

---

## 📄 License

MIT
