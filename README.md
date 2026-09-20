# Knowledge Base

A Next.js knowledge base. Content is authored as Markdoc (`.mdoc`) in `content/`
and edited through the Keystatic admin UI at `/keystatic`.

## How content is stored

Keystatic runs in **GitHub mode**: saving an entry commits it directly to `main`
in [`fltanveer/knowledge-base`](https://github.com/fltanveer/knowledge-base).
Vercel redeploys on that push and the site rebuilds from the committed files.

```
Keystatic UI  --commit-->  GitHub main  --auto-deploy-->  Vercel build  -->  live site
```

Pages read content with `createReader` from the checkout (`src/lib/reader.ts`),
not the GitHub API. That is deliberate: images uploaded through Keystatic land in
`public/images/`, which Next.js only serves from a build, so reading from the
build keeps Markdoc documents and their images in lockstep. The trade-off is that
an edit goes live one deploy later rather than instantly.

Relevant files:

| File | Role |
| --- | --- |
| `keystatic.config.tsx` | Storage mode, collections, Markdoc fields and components |
| `src/app/api/keystatic/[...params]/route.ts` | Keystatic API + GitHub OAuth callback |
| `src/app/keystatic/` | The admin UI |
| `src/lib/reader.ts` | Reads committed content at build time |

## Connecting to GitHub

### Guided setup (recommended)

```bash
npm install
npm run dev
```

Open <http://127.0.0.1:3000/keystatic>. With no credentials present it lands on
Keystatic's setup screen.

Use `127.0.0.1` rather than `localhost` — `@keystatic/next` normalises the host
to `127.0.0.1` before talking to GitHub, and that is the callback the App gets
registered with.

The setup form has two fields:

- **Organization** — leave blank to create the App on your personal account.
- **Deployed URL** — enter your Vercel URL (e.g.
  `https://knowledge-base.vercel.app`). Keystatic then registers the production
  callback alongside the local one. Skipping it means editing the App's settings
  after you deploy, so it is worth filling in now even if the URL is a guess.

Submitting creates a GitHub App named `fltanveer Keystatic` with `contents:
write`, `metadata: read` and `pull_requests: read`, redirects back to the app,
and writes the four credentials into a `.env` file (already gitignored). Install
the App on the `knowledge-base` repo when prompted.

### Manual setup

Create a GitHub App at <https://github.com/settings/apps/new> with:

- **Callback URLs** — add each host you will use:
  - `http://127.0.0.1:3000/api/keystatic/github/oauth/callback`
  - `https://<your-domain>/api/keystatic/github/oauth/callback`
- **Request user authorization (OAuth) during installation** — enabled
- **Webhook → Active** — disabled
- **Repository permissions** — Contents: read & write; Metadata: read-only;
  Pull requests: read-only

Then copy `.env.example` to `.env` and fill in the four values. Install the App
on the repo.

### Deploying to Vercel

Add the same four variables under **Project → Settings → Environment
Variables**. Vercel's default Git integration already redeploys on pushes to
`main`, which is what publishes Keystatic's commits — no extra webhook needed.

> `next build` **fails** in GitHub mode if `KEYSTATIC_GITHUB_CLIENT_ID`,
> `KEYSTATIC_GITHUB_CLIENT_SECRET` and `KEYSTATIC_SECRET` are missing — the
> Keystatic API route validates them while collecting page data. Set them for
> the Production, Preview and Development environments, or the build breaks
> before it reaches the content.

### Troubleshooting

**"Be careful! The `redirect_uri` is not associated with this application."**
The App has no callback URL registered for the host you are on. Open the App's
settings → **Add Callback URL** → add
`https://<host>/api/keystatic/github/oauth/callback` and save. This is the usual
symptom of deploying without having filled in **Deployed URL** during setup.

## Editing without GitHub

To work against the files in your working copy instead — offline, or before the
App exists — set:

```bash
NEXT_PUBLIC_KEYSTATIC_STORAGE=local
```

Saves then write to `content/` on disk, and you commit them yourself.

## Scripts

```bash
npm run dev     # dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```
