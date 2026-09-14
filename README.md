# ERP2026 - Enterprise Resource Planning System

Complete ERP system with 16 integrated modules built with Next.js 14, TypeScript, PostgreSQL, and Prisma.

## Features

### 16 Integrated Modules

**Core Business & Workforce**
- Financial Management (GL, AP, AR, Cash Flow)
- Human Resource Management (HRM/HCM)
- Workforce Management (WFM) - Timekeeping, Payroll
- Administration & RBAC Security

**Sales, Commerce & Customer**
- Customer Relationship Management (CRM)
- Order Management
- Point-of-Sale (POS)
- Configure, Price, Quote (CPQ)
- Ecommerce
- Marketing Automation

**Inventory, Procurement & Supply Chain**
- Inventory Management
- Procurement
- Warehouse Management System (WMS)
- Supply Chain Management (SCM)

**Operations, Manufacturing & Services**
- Manufacturing (MRP)
- Project Management (PSA)
- Field Service Management

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with RBAC
- **UI**: Tailwind CSS + shadcn/ui components
- **Validation**: Zod
- **State Management**: React Hooks, Server Components
- **Charts**: Recharts

## Project Structure

```
ERP2026/
├── apps/
│   └── web/              # Next.js application
├── packages/
│   ├── db/               # Prisma schema & database
│   ├── ui/               # Shared UI components
│   ├── auth/             # NextAuth configuration
│   └── types/            # Shared TypeScript types
├── PLAN.md               # Detailed implementation plan
├── DEPLOYMENT.md         # Deployment guide
└── README.md             # This file
```

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone repository
```bash
git clone <repository-url>
cd ERP2026
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your database credentials:
```
DATABASE_URL="postgresql://user:password@localhost:5432/erp2026"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

4. Set up database
```bash
cd packages/db
npx prisma generate
npx prisma db push
```

5. Run development server
```bash
cd ../../
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server

# Build
npm run build            # Build for production

# Lint
npm run lint             # Run ESLint

# Database
cd packages/db
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema to database
npx prisma studio        # Open Prisma Studio
```

### Database Management

```bash
# View database in GUI
cd packages/db
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset

# Create new migration
npx prisma migrate dev --name migration_name
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXTAUTH_URL`: Your Vercel domain
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
4. Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Digital Ocean App Platform
- AWS Amplify
- Self-hosted with Docker

## Architecture

### Monorepo Structure

Uses Turborepo for efficient builds:
- Shared packages for UI components, types, auth
- Independent package versioning
- Optimized build caching

### Database Schema

Comprehensive schema covering all 16 modules with:
- 80+ models
- Full relational integrity
- Row-level security support
- Multi-tenancy ready

### Authentication

- NextAuth.js with JWT strategy
- Role-Based Access Control (RBAC)
- Per-module permissions
- Audit logging
- Session management

## Module Overview

### Financial Management
- Double-entry accounting
- Automated financial statements
- Multi-currency support
- Budget vs actual tracking

### HRM
- Employee records
- Organizational structure
- Performance reviews
- Training management

### WFM
- Time clock integration
- Shift scheduling
- Leave management
- Automated payroll

### CRM
- Lead management
- Contact database
- Sales pipeline
- Activity tracking

### Order Management
- Order lifecycle
- Payment processing
- Stock allocation
- Fulfillment tracking

### POS
- Quick checkout
- Cash drawer management
- Shift reconciliation
- Offline support

### CPQ
- Dynamic pricing
- Product configuration
- Quote generation
- Approval workflows

### Ecommerce
- Online storefront
- Shopping cart
- Payment integration
- Order sync

### Marketing
- Campaign management
- Email automation
- Lead capture
- ROI tracking

### Inventory
- Real-time stock levels
- Multi-location
- Valuation methods
- Reorder automation

### Procurement
- Supplier management
- RFQ workflow
- Purchase orders
- Goods receipt

### WMS
- Bin management
- Pick/pack/ship
- Barcode scanning
- Warehouse transfers

### SCM
- Route optimization
- Shipment tracking
- Inter-warehouse transfers
- Carrier management

### Manufacturing
- BOM management
- Work orders
- Production scheduling
- Resource planning

### Project Management
- Project templates
- Gantt charts
- Resource allocation
- Milestone billing

### Field Service
- Technician dispatch
- Mobile tickets
- Equipment tracking
- Service history

## Security

- Row-level security for multi-tenancy
- Encrypted sensitive fields
- SQL injection prevention (Prisma)
- XSS protection (React)
- CSRF protection (NextAuth)
- API key management

## Performance

- Database indexing on foreign keys
- Query optimization with Prisma includes
- Server-side rendering
- Client-side pagination
- Caching strategy (Redis for session)

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

Proprietary - All rights reserved

## Support

For deployment issues, see [DEPLOYMENT.md](DEPLOYMENT.md)
For architecture details, see [PLAN.md](PLAN.md)

## Roadmap

- [ ] Phase 1: Foundation (Week 1-2)
- [ ] Phase 2: Core Modules (Week 3-4)
- [ ] Phase 3: Sales & Commerce (Week 5-6)
- [ ] Phase 4: Supply Chain (Week 7-8)
- [ ] Phase 5: Operations (Week 9-10)
- [ ] Phase 6: Integration & Polish (Week 11-12)
