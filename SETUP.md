# Quick Setup Guide

## Step 1: Install Dependencies

```bash
cd m-security
npm install
```

## Step 2: Supabase Configuration

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Wait for database to initialize

2. **Run Database Schema**
   - Open Supabase Dashboard → SQL Editor
   - Copy contents of `supabase/schema.sql`
   - Execute SQL

3. **Run Database Functions**
   - In SQL Editor
   - Copy contents of `supabase/functions.sql`
   - Execute SQL

4. **Get API Credentials**
   - Settings → API
   - Copy Project URL and anon/public key

## Step 3: Environment Setup

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
OPENAI_API_KEY=sk-your-openai-key-here
ADMIN_USERS=your-email@example.com
```

## Step 4: Seed Database (Optional)

```bash
npm run seed
```

Login with:
- Email: `alice@security.dev`
- Password: `password123`

## Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

---

**Need help?** Check `README.md` for detailed documentation.
