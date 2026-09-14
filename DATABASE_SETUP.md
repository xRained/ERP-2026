# Database Setup Guide

## Option 1: Local PostgreSQL (Windows)

### Install PostgreSQL
1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer, set password for `postgres` user
3. Note: Default port is 5432

### Create Database
```bash
# Open SQL Shell (psql) from Start Menu
# Enter password when prompted

# Create database
CREATE DATABASE erp2026;

# Create user (optional, can use postgres)
CREATE USER erp_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE erp2026 TO erp_user;

# Exit
\q
```

### Update .env.local
```bash
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/erp2026?schema=public"
```

## Option 2: Supabase (Recommended - Free)

### Setup
1. Go to [supabase.com](https://supabase.com)
2. Sign up/login
3. Create new project
4. Wait for database to be ready (~2 minutes)

### Get Connection String
1. Go to Project Settings > Database
2. Copy "Connection string" (URI format)
3. Format: `postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres`

### Update .env.local
```bash
DATABASE_URL="postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres"
```

## Option 3: Neon (Recommended - Free)

### Setup
1. Go to [neon.tech](https://neon.tech)
2. Sign up/login
3. Create new project
4. Copy connection string

### Update .env.local
```bash
DATABASE_URL="postgresql://[user]:[password]@ep-[region].aws.neon.tech/neondb"
```

## Option 4: Railway (Free Tier Available)

### Setup
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Copy connection string

## Run Prisma Setup

After database is ready:

```bash
# Navigate to db package
cd packages/db

# Generate Prisma client
npx prisma generate

# Push schema to database (creates all tables)
npx prisma db push

# Run seed script (creates demo user + permissions)
npx tsx prisma/seed.ts

# Optional: Open Prisma Studio (GUI)
npx prisma studio
```

## Verify Setup

```bash
# Test connection
cd packages/db
npx prisma db pull

# Should show "This action cannot be undone" if successful
```

## Troubleshooting

### Connection Issues
- Verify database is running
- Check firewall allows port 5432
- Verify connection string format
- Check password is correct

### Prisma Issues
```bash
# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset

# Regenerate client
npx prisma generate

# Check schema
npx prisma format
```

### SSL Issues (Cloud Databases)
Add `?sslmode=require` to connection string:
```bash
DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"
```

## Production Notes

- Use managed PostgreSQL (Supabase, Neon, Railway)
- Enable connection pooling
- Use SSL connections
- Set up automated backups
- Monitor connection limits
