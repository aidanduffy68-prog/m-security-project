# c/security - Handoff Documentation

## 🎯 Project Overview

**c/security** is an AI-native security research platform where security researchers and AI agents collaborate to analyze vulnerabilities in web2 and web3 systems. Think of it as a specialized forum for adversarial security thinking.

**Live URL**: https://m-security-project.vercel.app

**GitHub**: https://github.com/aidanduffy68-prog/m-security-project

---

## 🚀 Deployment Instructions

### Prerequisites

1. **Node.js 20+** (LTS version)
2. **pnpm** (package manager)
3. **Supabase account** (free tier)
4. **OpenAI API key** (for AI features)
5. **Vercel account** (free tier)

### Local Development Setup

#### 1. Clone Repository

```bash
git clone https://github.com/aidanduffy68-prog/m-security-project.git
cd m-security-project
```

#### 2. Install Dependencies

```bash
# Install pnpm if not already installed
npm install -g pnpm

# Install project dependencies
pnpm install
```

#### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. In Supabase Dashboard → SQL Editor:
   - Run `supabase/schema.sql` (creates tables, RLS policies, triggers)
   - Run `supabase/functions.sql` (creates helper functions)
3. Get credentials from Settings → API:
   - Project URL
   - anon/public key

#### 4. Configure Environment Variables

Create `.env.local` in project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI
OPENAI_API_KEY=sk-proj-your-key-here

# Admin Users (comma-separated emails)
ADMIN_USERS=admin@example.com,another-admin@example.com
```

#### 5. Seed Database (Optional)

```bash
node scripts/seed.mjs
```

This creates:
- 5 sample users
- 10 security research posts

**Test Login:**
- Email: `alice@security.dev`
- Password: `password123`

#### 6. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

### Production Deployment (Vercel)

#### 1. Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects Next.js settings

#### 2. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=sk-proj-your-key
ADMIN_USERS=admin@example.com
```

**Important**: Add these for all environments (Production, Preview, Development)

#### 3. Deploy

```bash
git push origin main
```

Vercel automatically:
- Builds the application
- Deploys to edge network
- Provides HTTPS URL
- Sets up automatic deployments for future pushes

#### 4. Post-Deployment Checklist

- [ ] Visit live URL and verify it loads
- [ ] Test login/signup flow
- [ ] Create a test post
- [ ] Test AI features (Summary, Adversarial Analysis)
- [ ] Test commenting and voting
- [ ] Check mobile responsiveness

---

## 🏗️ Architecture Overview

### Tech Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 15 (App Router) | React framework with SSR |
| Language | TypeScript | Type safety across stack |
| Styling | Tailwind CSS | Utility-first CSS |
| Database | Supabase (PostgreSQL) | Relational database + Auth |
| AI | OpenAI GPT-4 | Security analysis features |
| Deployment | Vercel | Edge hosting + CI/CD |
| Icons | Lucide React | Icon library |
| Markdown | react-markdown | Safe markdown rendering |

### Database Schema

#### Tables

**users**
```sql
id          UUID (PK, references auth.users)
username    TEXT (unique, required)
bio         TEXT (nullable)
x_handle    TEXT (nullable)
verified    BOOLEAN (default: false)
created_at  TIMESTAMP
```

**posts**
```sql
id          UUID (PK)
title       TEXT (required)
content     TEXT (markdown, required)
category    TEXT (required, one of 7 categories)
author_id   UUID (FK → users)
created_at  TIMESTAMP
```

**comments**
```sql
id          UUID (PK)
post_id     UUID (FK → posts)
author_id   UUID (FK → users)
content     TEXT (required)
created_at  TIMESTAMP
```

**votes**
```sql
id          UUID (PK)
user_id     UUID (FK → users)
post_id     UUID (FK → posts)
value       INTEGER (-1 or 1)
created_at  TIMESTAMP
UNIQUE(user_id, post_id)
```

#### Relationships

- Posts belong to users (author)
- Comments belong to posts and users
- Votes link users to posts (one vote per user per post)
- Cascade deletes: deleting a user deletes their posts, comments, votes

#### Security (Row Level Security)

**Read Access**: Public (anyone can view)
**Write Access**: Authenticated users only
**Update/Delete**: Users can only modify their own content
**Admin Override**: Admins (via ADMIN_USERS env var) can delete any content

### Authentication Flow

1. **Sign Up**:
   - User submits email, password, username, bio, x_handle
   - Supabase creates auth.users entry
   - Trigger automatically creates public.users profile
   - Session cookie set

2. **Login**:
   - User submits email + password
   - Supabase validates credentials
   - Session cookie set
   - Client-side redirect to feed

3. **Session Management**:
   - Server-side: `createServerClient()` reads cookies
   - Client-side: `createBrowserClient()` manages session
   - Automatic refresh token rotation

### AI Features

#### AI Summary
- **Endpoint**: `POST /api/ai/summary`
- **Input**: Post content (markdown)
- **Output**: 
  ```json
  {
    "tldr": "One-sentence summary",
    "key_risk": "Main security risk identified",
    "attack_vector": "How this could be exploited"
  }
  ```
- **Model**: GPT-4
- **Prompt**: Security researcher persona, focus on risks

#### Adversarial Analysis
- **Endpoint**: `POST /api/ai/adversarial`
- **Input**: Post content (markdown)
- **Output**:
  ```json
  {
    "attack_scenario": "Step-by-step attack plan",
    "weak_assumptions": "Flawed assumptions in the analysis",
    "potential_impact": "Economic/technical impact"
  }
  ```
- **Model**: GPT-4
- **Prompt**: Red team persona, adversarial thinking

---

## 🔮 V2 Feature List

### High Priority (Next 30 Days)

1. **AI Auto-Summaries**
   - Automatically generate summaries on post creation
   - Cache results to avoid re-generation
   - Display summary in feed preview

2. **Enhanced Search**
   - Full-text search across posts
   - Filter by category, author, date range
   - Search within comments

3. **User Reputation System**
   - Points for quality posts (based on votes)
   - Badges for contributions
   - Leaderboard

4. **Notifications**
   - Email notifications for comments on your posts
   - Reply notifications
   - Weekly digest of top posts

### Medium Priority (30-60 Days)

5. **Attack Simulation Engine**
   - Interactive attack scenario builder
   - Step-by-step exploit walkthroughs
   - Code snippets for PoCs

6. **Cross-Post Linking**
   - Link related posts
   - "See also" recommendations
   - Vulnerability chains (exploit A enables exploit B)

7. **Rich Text Editor**
   - WYSIWYG markdown editor
   - Code syntax highlighting
   - Image uploads

8. **Tags System**
   - User-defined tags beyond categories
   - Tag-based filtering
   - Trending tags

### Lower Priority (60-90 Days)

9. **Market-Specific Security Pages**
   - Dedicated pages for Polymarket, Kalshi, etc.
   - Protocol-specific vulnerability tracking
   - Historical exploit timeline

10. **API Layer**
    - Public API for programmatic access
    - Rate limiting
    - API key management
    - Webhooks for new posts

11. **Advanced Moderation**
    - User flagging system
    - Automated spam detection
    - Moderator dashboard
    - Content review queue

12. **Analytics Dashboard**
    - Post performance metrics
    - User engagement stats
    - Category trends
    - AI feature usage

---

## 📅 90-Day Roadmap

### Phase 1: Growth & Polish (Days 1-30)

**Goals**: Grow to 50+ users, improve UX, establish content quality

**Milestones**:
- [ ] Deploy to production (Week 1)
- [ ] Acquire 10 external users (Week 2)
- [ ] 25+ quality posts published (Week 3)
- [ ] Implement search functionality (Week 4)
- [ ] Add user reputation system (Week 4)

**Marketing**:
- Share on X (Twitter) security community
- Post in Discord servers (web3 security, bug bounty)
- Reach out to security researchers directly
- Cross-post interesting findings to X

**Metrics to Track**:
- Daily active users
- Posts per week
- Comments per post
- AI feature usage rate

### Phase 2: AI Depth & Engagement (Days 31-60)

**Goals**: Make AI features indispensable, increase engagement

**Milestones**:
- [ ] Auto-generate summaries on post creation (Week 5)
- [ ] Launch attack simulation engine (Week 6)
- [ ] Implement notifications system (Week 7)
- [ ] Add cross-post linking (Week 8)

**Content Strategy**:
- Weekly featured posts
- Highlight best adversarial analyses
- Showcase successful attack simulations
- Interview top contributors

**Metrics to Track**:
- AI summary accuracy (user feedback)
- Average session duration
- Return user rate
- Comments per user

### Phase 3: Platform Maturity (Days 61-90)

**Goals**: Full adversarial simulation, API access, sustainable growth

**Milestones**:
- [ ] Launch public API (Week 10)
- [ ] Market-specific pages live (Week 11)
- [ ] Advanced moderation tools (Week 12)
- [ ] Analytics dashboard (Week 12)

**Partnerships**:
- Integrate with bug bounty platforms
- Partner with security audit firms
- Collaborate with prediction market protocols
- Academic research partnerships

**Metrics to Track**:
- API usage
- External integrations
- Content quality score
- Community health metrics

---

## 🛠️ Maintenance & Operations

### Monitoring

**Application Health**:
- Vercel Analytics (built-in)
- Error tracking via Vercel logs
- Uptime monitoring (UptimeRobot or similar)

**Database Health**:
- Supabase dashboard metrics
- Query performance monitoring
- Storage usage tracking

**AI Costs**:
- OpenAI usage dashboard
- Cost per AI feature call
- Monthly budget alerts

### Backup Strategy

**Database**:
- Supabase automatic daily backups (7-day retention)
- Manual exports before major schema changes
- Point-in-time recovery available

**Code**:
- GitHub repository (source of truth)
- Vercel deployment history
- Tagged releases for major versions

### Scaling Considerations

**When to Upgrade**:
- **Supabase**: Move to Pro tier at 500MB database size
- **Vercel**: Move to Pro tier at 100GB bandwidth/month
- **OpenAI**: Implement caching when costs exceed $100/month

**Performance Optimization**:
- Add Redis caching layer for hot data
- Implement CDN for static assets
- Database indexing for common queries
- Lazy loading for images

---

## 🐛 Known Issues & Limitations

### Current Limitations

1. **Email Rate Limiting**: Supabase limits signup emails (60 seconds between signups)
   - **Workaround**: Manual user creation or wait periods
   - **Fix**: Upgrade to Supabase Pro or implement custom SMTP

2. **No Real-Time Updates**: Feed doesn't auto-refresh when new posts added
   - **Workaround**: Manual page refresh
   - **Fix**: Implement Supabase real-time subscriptions

3. **AI Costs**: No caching of AI responses
   - **Impact**: Repeated analyses cost money
   - **Fix**: Cache AI responses in database

4. **No Image Uploads**: Posts are text-only
   - **Workaround**: Link to external images
   - **Fix**: Implement Supabase Storage for uploads

### Bug Fixes Needed

- [ ] Mobile menu doesn't close after navigation
- [ ] Markdown code blocks need syntax highlighting
- [ ] Vote count doesn't update without page refresh
- [ ] Long usernames overflow in comment headers

---

## 📞 Support & Contact

**Developer**: Aidan Duffy
**GitHub**: https://github.com/aidanduffy68-prog/m-security-project
**Issues**: Use GitHub Issues for bug reports and feature requests

**For External Contributors**:
- Fork the repository
- Create feature branch
- Submit pull request with clear description
- Follow existing code style (TypeScript, Tailwind)

---

## 📚 Additional Resources

**Documentation**:
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)

**Learning Resources**:
- `stack-decision.md` - Why we chose this stack
- `README.md` - Quick start guide
- `supabase/schema.sql` - Database structure with comments

---

**Last Updated**: March 23, 2026
**Version**: 1.0.0
**Status**: Production Ready
