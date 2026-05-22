# Firebase Site — Vercel Deployment

Fetches and serves HTML stored in Firebase Realtime Database via a Node.js/Express serverless function on Vercel.

## Database Structure Expected

```
pages/
  user_site_01/
    htmlCode: "<your full HTML string here>"
```

## Local Development

```bash
npm install
node api/index.js
# Visit http://localhost:3000
```

> Note: For local dev you'll need a small wrapper. See below.

## Deploy to Vercel via GitHub

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repo
4. Leave all settings as default — Vercel auto-detects everything
5. Click **Deploy**

That's it. Every push to `main` will auto-redeploy.

## How It Works

- `vercel.json` routes all requests to `/api/index`
- `api/index.js` is an Express app that Vercel runs as a serverless function
- On each request, it reads `pages/user_site_01/htmlCode` from Firebase and serves it as `text/html`
