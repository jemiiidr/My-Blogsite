# LUCID Blog

A full-stack Next.js 16 blog built with the App Router, React 19, TypeScript, Tailwind CSS, Neon Postgres, Drizzle ORM, Server Actions, Zod, and Vercel Blob.

## Included features

- Public home, blog, category, author, and individual post pages
- Required cover image upload for new posts through Vercel Blob
- Automatically generated collision-safe post slugs (`title`, `title-2`, `title-3`, and so on)
- Draft and publish workflows controlled by authenticated admin/author roles
- Reader registration; every public signup receives the `user` role
- Login, logout, database-backed sessions, and reader profile management
- Guest and registered-user comments with validation and rate limiting
- Paginated public comments and paginated blog results
- Blog category heading dividers
- Admin dashboard with posts, analytics, and comment moderation
- Drizzle SQL migrations committed in `drizzle/`
- Cache Components enabled for the Next.js 16 Partial Prerendering model

## Environment variables

Copy `.env.example` to `.env.local` and set:

```env
DATABASE_URL=
SESSION_SECRET=
BLOB_READ_WRITE_TOKEN=
```

The Blob store must be public because cover images are displayed on public blog pages.

## Local setup

```bash
corepack enable
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open `http://localhost:3000`.

## Database workflow

After changing `lib/db/schema.ts`:

```bash
pnpm db:generate
pnpm db:migrate
```

Commit the generated SQL and metadata in `drizzle/`. Do not rely on `drizzle-kit push` alone.

## Seeded accounts

After running `pnpm db:seed`:

- Admin: `admin@lucid.local` / `Admin123!`
- Author: `author@lucid.local` / `Author123!`
- Reader: `reader@lucid.local` / `Reader123!`
