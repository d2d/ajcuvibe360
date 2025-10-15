# 360° Performance Review Application

A beautiful, responsive web application for conducting comprehensive 360-degree performance reviews with anonymous feedback aggregation.

## Features

- **Multi-Category Reviews**: Collect feedback from Subordinates, Peers, Supervisors, and Others
- **18 Standard Questions**: Professionally crafted questions across 5 key categories
- **Anonymous Responses**: Reviewers submit feedback anonymously
- **Unique Review Links**: Generate secure, one-time-use links for each reviewer
- **Visual Dashboard**: Beautiful charts and aggregated results by category
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Production database (SQLite for local dev)
- **shadcn/ui** - Beautiful, accessible UI components
- **Recharts** - Interactive data visualizations

## Getting Started

### Prerequisites

- Node.js 20+ installed on your machine
- npm (comes with Node.js)

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run database migrations and seed questions:**
   ```bash
   npx prisma migrate dev
   ```
   This will create the SQLite database and seed it with 18 standard questions.

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

### 1. Create a Review

- Click "Create New Review" on the home page
- Enter your information and the reviewee's name
- Add reviewers by entering their email and selecting their category:
  - **Subordinate** - People who report to the reviewee
  - **Peer** - Colleagues at the same level
  - **Supervisor** - Managers or leaders
  - **Other** - Anyone else providing feedback

### 2. Share Review Links

- After creating a review, you'll see unique links for each reviewer
- Copy and share these links with the respective reviewers
- Each link can only be used once to submit feedback

### 3. Reviewers Submit Feedback

- Reviewers click their unique link
- Answer 18 questions using a 5-point Likert scale (1-5)
- Questions 1-17: Rate from "Strongly Disagree" to "Strongly Agree"
- Question 18: Provide specific feedback on areas for development
- Submit the completed review

### 4. View Results Dashboard

- Once reviews are submitted, access the results dashboard
- View aggregated data by category (individual responses remain anonymous)
- Explore three different views:
  - **Overview**: High-level summary with charts
  - **By Category**: Detailed breakdown by reviewer category
  - **Detailed Questions**: Individual question analysis

## The 18 Standard Questions

### Leadership & Vision (3 questions)
1. Demonstrates clear vision and strategic thinking
2. Inspires and motivates others
3. Makes effective decisions under pressure

### Communication & Collaboration (4 questions)
4. Communicates clearly and effectively
5. Actively listens to others' perspectives
6. Collaborates well across teams
7. Provides constructive feedback

### Performance & Results (3 questions)
8. Consistently delivers high-quality work
9. Meets deadlines and commitments
10. Takes initiative and ownership

### Professional Development (3 questions)
11. Continuously learns and develops new skills
12. Adapts well to change
13. Shares knowledge with others

### Interpersonal Skills (3 questions)
14. Builds positive working relationships
15. Shows respect and empathy
16. Handles conflicts constructively

### Overall Assessment (2 questions)
17. Overall effectiveness in their role
18. What are the key areas for development? (open-ended)

## Database Schema

- **Review** - Main review instance (owner info, reviewee name)
- **Reviewer** - Individual reviewers (category, unique token, email)
- **Response** - Submitted feedback (ratings and comments)
- **Question** - The 18 standard questions

## Project Structure

```
three_60/
├── app/
│   ├── api/                    # API routes
│   │   ├── reviews/           # Review CRUD operations
│   │   ├── reviewers/         # Reviewer data by token
│   │   └── responses/         # Submit feedback
│   ├── create/                # Review creation page
│   ├── submit/[token]/        # Review submission page
│   ├── review/[reviewId]/
│   │   ├── manage/            # Review management & links
│   │   └── results/           # Results dashboard
│   ├── page.tsx               # Landing page
│   └── layout.tsx             # Root layout
├── components/ui/             # shadcn/ui components
├── lib/
│   ├── prisma.ts              # Prisma client
│   └── utils.ts               # Utility functions
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Database seeding
│   └── migrations/            # Database migrations
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed database with questions
- `npx prisma studio` - Open Prisma Studio (database GUI)

## Environment Variables

The `.env` file contains:

```
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

Change `NEXT_PUBLIC_BASE_URL` when deploying to production.

## Features in Detail

### Anonymous Aggregation

- Individual responses are never shown
- Results are aggregated by category only
- Ensures honest, unbiased feedback
- Reviewer names are collected but not displayed with responses

### Visual Analytics

- **Bar Charts**: Compare average scores across categories
- **Radar Charts**: Visualize performance across skill areas
- **Progress Bars**: Individual question breakdowns
- **Category Badges**: Color-coded reviewer categories

### Responsive Design

- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interfaces
- Beautiful gradient backgrounds

## Deploying to Production (Vercel)

This application is optimized for deployment on [Vercel](https://vercel.com), the platform built by the creators of Next.js.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/three_60)

### Manual Deployment Steps

#### 1. Create a Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with your GitHub account (free)

#### 2. Set Up PostgreSQL Database

**Option A: Vercel Postgres (Recommended)**
1. In Vercel dashboard, go to **Storage** → **Create Database**
2. Select **Postgres**
3. Choose a name and region
4. Click **Create**
5. Copy the `DATABASE_URL` connection string

**Option B: Supabase (Alternative)**
1. Go to [supabase.com](https://supabase.com) and create a project
2. Navigate to **Settings** → **Database**
3. Copy the connection string (use the "Session pooler" connection)

#### 3. Push Your Code to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Ready for Vercel deployment"

# Create a new repository on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/three_60.git
git branch -M main
git push -u origin main
```

#### 4. Deploy to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. **Import** your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

5. Add **Environment Variables**:
   ```
   DATABASE_URL=postgresql://your-connection-string
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   ```

6. Click **"Deploy"**

#### 5. Run Database Migrations

After the initial deployment:

1. Install Vercel CLI locally:
   ```bash
   npm install -g vercel
   ```

2. Link your local project to Vercel:
   ```bash
   vercel link
   ```

3. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

4. Run migrations against production database:
   ```bash
   npx prisma migrate deploy
   ```

5. Seed the database with questions:
   ```bash
   npm run db:seed
   ```

#### 6. Access Your Deployed App

Your app will be live at: `https://your-app-name.vercel.app`

### Continuous Deployment

Once set up, every push to your `main` branch will automatically:
- Build and deploy the latest version
- Run database migrations (via `postinstall` script)
- Update your production environment

### Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Navigate to **Settings** → **Domains**
3. Add your custom domain
4. Follow the DNS configuration instructions
5. Update `NEXT_PUBLIC_BASE_URL` environment variable

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXT_PUBLIC_BASE_URL` | Your app's public URL | `https://your-app.vercel.app` |

### Troubleshooting

**Build Fails**
- Check that all environment variables are set
- Verify `DATABASE_URL` is a valid PostgreSQL connection string

**Database Connection Errors**
- Ensure your Postgres instance allows connections from Vercel
- Check that connection pooling is enabled (Supabase: use "Session pooler")

**Seed Command Fails**
- Make sure migrations ran successfully first
- Verify you're connected to the correct database

## Future Enhancements

Potential features to add:
- Email notifications to reviewers
- PDF export of results
- Custom question sets
- Historical review tracking
- Multi-language support

## License

MIT License - feel free to use this for your organization!

## Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using Next.js and modern web technologies
