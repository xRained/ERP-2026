# ERP2026 Deployment Guide

## Overview
ERP2026 is a comprehensive ERP system built with Next.js 14, TypeScript, PostgreSQL, and Prisma. This guide covers deployment to production.

## Tech Stack
- **Frontend**: Next.js 14 with App Router
- **Backend**: Next.js API routes + Prisma ORM
- **Database**: PostgreSQL (Supabase recommended)
- **Authentication**: NextAuth.js with RBAC
- **UI**: Tailwind CSS + shadcn/ui
- **Monorepo**: Turborepo structure

## Prerequisites
- Node.js 18+ 
- PostgreSQL database (Supabase, Neon, or Railway)
- Vercel account (for deployment)
- Git repository

## Environment Variables

### Required Variables
```bash
DATABASE_URL="postgresql://user:password@host:port/database"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="generate-random-secret"
```

### Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

## Deployment Options

### Option 1: Vercel (Recommended)

#### Step 1: Database Setup
**Supabase (Recommended)**
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string (URI format)
5. Add to Vercel environment variables

**Neon**
1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Add to Vercel environment variables

**Railway**
1. Create account at [railway.app](https://railway.app)
2. Add PostgreSQL database
3. Copy connection string
4. Add to Vercel environment variables

#### Step 2: Environment Variables
Add these to Vercel project settings:
```
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate-random-secret
```

#### Step 3: Deploy to Vercel

**Option A: Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel
```

**Option B: GitHub Integration**
1. Push code to GitHub
2. Go to Vercel dashboard
3. "Add New Project" > "Import Git Repository"
4. Configure build settings:
   - Framework Preset: Next.js
   - Root Directory: `apps/web`
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### Step 4: Database Migration
After deployment, run migrations:
```bash
cd packages/db
npx prisma db push
```

#### Step 5: Seed Data (Optional)
Create admin user:
```bash
cd packages/db
npx tsx prisma/seed.ts
```

### Option 2: Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      - db
  
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=erp2026
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

#### Build and Run
```bash
docker-compose up -d
```

### Option 3: Traditional VPS

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### PM2 Process Manager
```bash
npm install -g pm2
pm2 start npm --name "erp2026" -- start
pm2 save
pm2 startup
```

## Database Setup

### Prisma Configuration
Ensure `DATABASE_URL` is set in your environment variables.

### Run Migrations
```bash
cd packages/db
npx prisma generate
npx prisma db push
```

### Seed Data
```bash
npx tsx prisma/seed.ts
```

## Environment-Specific Configuration

### Development
```bash
# .env.local
DATABASE_URL="postgresql://localhost:5432/erp2026"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret"
```

### Production
```bash
# Vercel Environment Variables
DATABASE_URL="postgresql://user:pass@host:port/db"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="production-secret"
```

## Security Considerations

### Required Environment Variables
- `DATABASE_URL`: Never commit to git
- `NEXTAUTH_SECRET`: Generate unique per environment
- `NEXTAUTH_URL`: Set to production domain

### Additional Security
- Enable HTTPS (automatic on Vercel)
- Set up CSP headers
- Use Vercel Edge Functions for auth
- Enable database SSL

## Performance Optimization

### Vercel Configuration
- Automatic image optimization enabled
- Edge functions for auth
- CDN caching for static assets

### Database Optimization
- Enable connection pooling
- Use read replicas for read-heavy operations
- Index frequently queried columns

### Monitoring
- Vercel Analytics (built-in)
- Database monitoring (provider-specific)
- Error tracking (Sentry recommended)

## Troubleshooting

### Build Errors
- Check Node.js version (18+ required)
- Verify all dependencies installed
- Clear cache: `rm -rf .next`

### Database Connection Issues
- Verify connection string format
- Check database allows external connections
- Ensure SSL enabled
- Verify database is active

### Auth Issues
- Check `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches domain
- Check database adapter configuration

## Scaling Considerations

### Database Scaling
- Use managed PostgreSQL service
- Enable connection pooling
- Consider read replicas for scaling
- Monitor query performance

### Application Scaling
- Vercel automatically scales
- Use Edge Functions for global performance
- Implement caching strategies
- Consider CDN for static assets

## Backup Strategy

### Database Backups
- Enable automated backups (provider feature)
- Regular export to external storage
- Test restore procedures

### Application Backups
- Git provides code backup
- Environment variables in Vercel
- Document configuration changes

## Monitoring & Logging

### Vercel Dashboard
- Real-time logs
- Performance metrics
- Error tracking
- Deployment history

### Database Monitoring
- Query performance
- Connection usage
- Storage growth
- Backup status

## Cost Optimization

### Vercel
- Use Pro plan for production
- Monitor bandwidth usage
- Optimize image sizes
- Cache static assets

### Database
- Choose appropriate tier
- Monitor connection usage
- Optimize queries
- Clean up old data

## Post-Deployment Checklist

- [ ] Database created and connection string added
- [ ] Environment variables configured
- [ ] NEXTAUTH_SECRET generated
- [ ] Database migrations run
- [ ] SSL enabled on database
- [ ] Custom domain configured (optional)
- [ ] Error tracking set up (optional)
- [ ] Monitoring configured
- [ ] Backup strategy implemented
- [ ] Security headers configured
- [ ] Performance testing completed
- [ ] Load testing (if needed)
- [ ] DNS propagated (if custom domain)
- [ ] SSL certificate valid
- [ ] Database backups enabled
- [ ] Application tested end-to-end

## Support

For deployment issues:
- Vercel Documentation: https://vercel.com/docs
- Prisma Documentation: https://www.prisma.io/docs
- NextAuth Documentation: https://next-auth.js.org
