# 🚀 Deploy to Vercel - Quick Guide

## Prerequisites Checklist

- ✅ Code is working locally (`pnpm dev` runs successfully)
- ✅ Supabase database is set up with schema and functions
- ✅ `.env.local` has all required variables
- ✅ GitHub repository exists: https://github.com/aidanduffy68-prog/m-security-project

## Step-by-Step Deployment

### 1. Push Code to GitHub

```bash
# Make sure you're in the project directory
cd m-security

# Add all files
git add .

# Commit
git commit -m "Initial deployment - m/security platform"

# Push to main branch
git push origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository: `aidanduffy68-prog/m-security-project`
5. Vercel will auto-detect Next.js settings - **don't change anything**
6. Click **"Deploy"**

### 3. Add Environment Variables

**IMPORTANT**: Before the first deployment completes, add environment variables:

1. In Vercel Dashboard → **Settings** → **Environment Variables**
2. Add these 4 variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://ghuijdpminpvvkmqvvzh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
OPENAI_API_KEY=[your-openai-key]
ADMIN_USERS=[your-email@example.com]
```

3. Select **"Production"**, **"Preview"**, and **"Development"** for each
4. Click **"Save"**
5. Go to **Deployments** tab
6. Click **"..."** on the latest deployment → **"Redeploy"**

### 4. Verify Deployment

Once deployed, Vercel will give you a URL like: `https://m-security-project.vercel.app`

**Test these:**
- [ ] Site loads
- [ ] Can sign up for new account
- [ ] Can log in with test account (alice@security.dev / password123)
- [ ] Can create a post
- [ ] Can view post detail page
- [ ] Can add a comment
- [ ] Can vote on posts
- [ ] AI buttons appear (may need OpenAI key to test fully)

### 5. Update Documentation

Once deployed, update these files with your live URL:

**README.md:**
```markdown
**Live Demo**: https://your-app.vercel.app
```

**handoff.md:**
```markdown
**Live URL**: https://your-app.vercel.app
```

### 6. Create Seed Posts

Follow instructions in `POST-DEPLOYMENT-TASKS.md` to create 10+ posts through the UI.

---

## Troubleshooting

### Build Fails

**Error**: Missing environment variables
- **Fix**: Add all 4 env vars in Vercel dashboard, then redeploy

**Error**: TypeScript errors
- **Fix**: These should be warnings only. Check Vercel build logs.

### Site Loads but Features Don't Work

**Error**: Can't sign up/login
- **Fix**: Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

**Error**: AI buttons don't work
- **Fix**: Check `OPENAI_API_KEY` is set correctly

**Error**: Can't create posts
- **Fix**: Make sure you're logged in. Check browser console for errors.

### Database Issues

**Error**: "relation does not exist"
- **Fix**: Run `supabase/schema.sql` in Supabase SQL Editor

**Error**: "row-level security policy"
- **Fix**: Make sure RLS policies were created in schema.sql

---

## Post-Deployment Checklist

After successful deployment:

- [ ] Update README.md with live URL
- [ ] Update handoff.md with live URL  
- [ ] Create 10+ posts via UI (see POST-DEPLOYMENT-TASKS.md)
- [ ] Test all features on production
- [ ] Share link with 3+ security researchers
- [ ] Monitor for user signups and activity

---

## Quick Commands

```bash
# Local development
pnpm dev

# Build locally (test before deploying)
pnpm build

# Check for TypeScript errors
pnpm lint

# Deploy (just push to GitHub)
git push origin main
```

---

**Estimated Time**: 15-20 minutes for initial deployment

**Next**: See `POST-DEPLOYMENT-TASKS.md` for creating seed content and acquiring users.
