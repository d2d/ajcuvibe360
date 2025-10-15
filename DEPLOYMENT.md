# Deployment Guide - Vercel

This guide will walk you through deploying your 360° Performance Review application to Vercel in about 15-20 minutes.

## Prerequisites

- A GitHub account
- This repository pushed to GitHub
- 15-20 minutes of your time

## Step-by-Step Deployment

### Step 1: Create Vercel Account (2 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### Step 2: Set Up Database (5 minutes)

You have two options:

#### Option A: Vercel Postgres (Easiest)

1. In Vercel dashboard, click on **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Name your database (e.g., `three-60-db`)
5. Select a region close to your users
6. Click **"Create"**
7. Once created, click on the database
8. Go to **".env.local"** tab
9. Copy the `DATABASE_URL` value

**Free Tier Limits:**
- 256 MB storage
- 60 compute hours/month
- Perfect for this application!

#### Option B: Supabase (More Features)

1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub
3. Click **"New Project"**
4. Fill in:
   - Name: `three-60`
   - Database Password: (choose a strong password)
   - Region: (closest to you)
5. Wait 2 minutes for project to provision
6. Go to **Settings** → **Database**
7. Scroll to **Connection String**
8. Select **"Session pooler"** tab
9. Copy the URI connection string
10. Replace `[YOUR-PASSWORD]` with your actual password

**Free Tier Limits:**
- 500 MB database
- Unlimited API requests
- Real-time subscriptions included

### Step 3: Deploy to Vercel (3 minutes)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Find your `three_60` repository and click **"Import"**
4. Configure project settings:
   - **Project Name**: `three-60-review` (or whatever you prefer)
   - **Framework Preset**: Next.js ✅ (auto-detected)
   - **Root Directory**: `./` ✅
   - **Build Command**: `npm run build` ✅
   - **Install Command**: `npm install` ✅

5. Click **"Environment Variables"**
6. Add the following:

   **Variable 1:**
   - Name: `DATABASE_URL`
   - Value: (paste your database connection string from Step 2)

   **Variable 2:**
   - Name: `NEXT_PUBLIC_BASE_URL`
   - Value: `https://your-project-name.vercel.app` (update after deployment)

7. Click **"Deploy"**
8. Wait 2-3 minutes for deployment to complete

### Step 4: Update Base URL (1 minute)

1. Once deployed, Vercel will show you your live URL (e.g., `https://three-60-review.vercel.app`)
2. Go to **Settings** → **Environment Variables**
3. Find `NEXT_PUBLIC_BASE_URL`
4. Click **"Edit"**
5. Update to your actual Vercel URL
6. Click **"Save"**
7. Go to **Deployments** → Click **"..."** on latest deployment → **"Redeploy"**

### Step 5: Initialize Database (5 minutes)

Now we need to create the database tables and seed the questions.

#### On Your Local Machine:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Link your local project to Vercel:
   ```bash
   vercel link
   ```
   - Select your team/account
   - Confirm the project name
   - Link to existing project

4. Pull production environment variables:
   ```bash
   vercel env pull .env.local
   ```

5. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

   You should see:
   ```
   ✔ Applied migration 20251009_init_postgres
   ```

6. Seed the database with 18 questions:
   ```bash
   npm run db:seed
   ```

   You should see:
   ```
   Seeding database...
   Seeded 18 questions successfully!
   ```

### Step 6: Test Your Deployed App (2 minutes)

1. Open your Vercel URL in a browser
2. Click **"Create New Review"**
3. Fill out the form and add some reviewers
4. You should see the management page with unique links
5. Copy one of the reviewer links and open in an incognito window
6. Fill out the review and submit
7. Go back to the management page and verify response count updated
8. Click **"View Results Dashboard"**

**If everything works, you're done! 🎉**

## Post-Deployment

### Continuous Deployment

Every time you push to your `main` branch on GitHub, Vercel will automatically:
1. Build your application
2. Run tests (if configured)
3. Deploy the new version
4. Run `prisma generate` (via postinstall script)

### Custom Domain (Optional)

1. Buy a domain from any registrar (Namecheap, Google Domains, etc.)
2. In Vercel dashboard, go to your project
3. Click **Settings** → **Domains**
4. Click **"Add Domain"**
5. Enter your domain (e.g., `review.mycompany.com`)
6. Follow DNS configuration instructions
7. Wait for DNS propagation (5-60 minutes)
8. Update `NEXT_PUBLIC_BASE_URL` environment variable to your custom domain
9. Redeploy

### Monitoring & Logs

- **View Logs**: Vercel Dashboard → Your Project → **Deployments** → Click deployment → **Function Logs**
- **Analytics**: Vercel Dashboard → Your Project → **Analytics** (on Pro plan)
- **Errors**: Automatically tracked in deployment logs

## Troubleshooting

### Build Failed

**Error: "DATABASE_URL is not defined"**
- Solution: Add `DATABASE_URL` in Vercel environment variables

**Error: "prisma generate failed"**
- Solution: Ensure `postinstall` script is in `package.json`

### Database Connection Issues

**Error: "Can't reach database server"**
- Vercel Postgres: Check database is running in Vercel dashboard
- Supabase: Ensure you're using "Session pooler" connection string, not "Direct connection"

**Error: "Too many connections"**
- Solution: Enable connection pooling (Supabase handles this automatically)

### Migration Issues

**Error: "Migration failed"**
- Solution: Delete all data in your Postgres database and run `npx prisma migrate deploy` again
- Or: Run `npx prisma migrate reset` (WARNING: deletes all data)

### Seed Failed

**Error: "Table 'Question' does not exist"**
- Solution: Run migrations first: `npx prisma migrate deploy`

**Error: "Questions already exist"**
- Solution: This is fine! The seed script checks for existing questions

## Updating Your Deployed App

```bash
# Make your code changes locally
git add .
git commit -m "Updated feature X"
git push origin main

# Vercel automatically deploys!
# Check deployment status at https://vercel.com/dashboard
```

## Scaling Considerations

**Free Tier is Fine For:**
- Up to 100 reviews/month
- Up to 1000 reviewers total
- Small to medium organizations

**Upgrade to Pro If:**
- You need more database storage (Vercel Postgres: upgrade to 10GB)
- You need custom domains with SSL
- You want priority support
- You need team collaboration features

## Cost Breakdown

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Vercel Hosting | Unlimited bandwidth | Same + advanced features |
| Vercel Postgres | 256MB, 60 hrs/month | $10/mo for 10GB |
| Supabase | 500MB database | $25/mo for 8GB |
| **Total** | **$0/month** | **$10-25/month** |

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Issues**: Open an issue on GitHub

---

**You're all set!** Your 360° Performance Review app is now live on the internet. 🚀
