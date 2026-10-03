# James Cahours Portfolio

Personal portfolio website for [jamescahours.com](https://jamescahours.com).

## Stack

- Next.js
- React
- TypeScript
- Vercel-ready

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Next steps

- Add real project case studies
- Add resume/work history
- Add contact information
- Connect Vercel
- Add a database-backed project/blog section with Postgres


## Content editor

Visit `/admin` to edit the homepage, projects, categories, About, contact links, and footer. Only GitHub account ID **52476217** (`jamescahours`) can sign in. Publishing commits `content/site.json` to `main`; Vercel then rebuilds the public site. Unpublished changes stay in the current browser tab. The editor detects conflicting edits using GitHub's file SHA. GitHub commit history provides recovery of earlier revisions.

### One-time production setup

1. Create a GitHub OAuth app at https://github.com/settings/applications/new:
   - Name: `James Cahours Content Studio`
   - Homepage: `https://jamescahours.com`
   - Authorization callback: `https://jamescahours.com/api/admin/callback`
2. In the Vercel **portfolio** project, add these **Production** environment variables:
   - `GITHUB_CLIENT_ID`: the OAuth app client ID.
   - `GITHUB_CLIENT_SECRET`: the OAuth app client secret. Keep it private.
   - `ADMIN_SESSION_SECRET`: a random secret of at least 32 characters. Generate with `openssl rand -hex 32`.
   - `ADMIN_ORIGIN`: `https://jamescahours.com` (must match the canonical domain; use `www` here and in the OAuth URLs if the site redirects there).
3. Redeploy, then visit `https://jamescahours.com/admin` and sign in with GitHub.

No database or personal access token is needed. The OAuth app requests `public_repo`, which can grant access to public repositories beyond this site; this application only writes the fixed `jamescahours/Portfolio/content/site.json` path on `main`. Access tokens remain in authenticated encrypted HttpOnly cookies with an eight-hour lifetime. GitHub identity is checked again on each content read/write. Sign-out clears the browser session; revoke the OAuth app in GitHub settings to revoke its token. Rotate the session secret to invalidate all sessions.

The admin is disabled until all secrets are configured. Never prefix secrets with `NEXT_PUBLIC_` or commit them. Preview deployments should not receive production OAuth secrets. For local testing, use a separate OAuth app with `http://localhost:3000/api/admin/callback` and set `ADMIN_ORIGIN=http://localhost:3000` in `.env.local`.

### Verification

`npm run build` checks types and production compilation. `node --test tests/admin.test.cjs` tests the content schema and encrypted session behavior through a bundled test harness (see the test file). OAuth round-trip and real publishing require the configured app and account owner; do not use fabricated credentials.
