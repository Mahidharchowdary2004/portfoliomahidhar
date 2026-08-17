# Portfolio Frontend (React + TypeScript)

The portfolio site, rebuilt as a React + TypeScript app using Vite. Every
section is a component; content starts as static default data
(`src/data/defaults.ts`) and is replaced by live data from the backend API
once `API_BASE` is set.

## Structure

```
index.html                Vite entry point (mounts React into #root)
src/
  main.tsx                 React entry point
  App.tsx                   assembles all sections
  types.ts                   shared TypeScript interfaces (match backend API)
  data/defaults.ts           static fallback content for every section
  api/client.ts               API_BASE config, fetch helper, analytics tracking
  hooks/
    useResource.ts             generic "default, then try live data" hook
    useSectionTracking.ts       logs one pageview per section per visit
  components/
    Header.tsx, Hero.tsx, About.tsx, Skills.tsx, Experience.tsx,
    Projects.tsx, Certifications.tsx, Achievements.tsx, Contact.tsx,
    Footer.tsx                  one component per section
    Terminal.tsx                 hero typing-effect animation
    Reveal.tsx                    scroll-in-view fade/slide wrapper
    icons.tsx                     inline SVG icon components
  styles/global.css            all styling (unchanged from the previous build)
public/
  robots.txt, sitemap.xml     for Google Search Console
```

## Setup

```bash
npm install
npm run dev        # starts Vite dev server with hot reload, usually http://localhost:5173
```

## Building for production

```bash
npm run build       # type-checks, then builds to dist/
npm run preview      # serves the production build locally to sanity-check it
```

`dist/` is a normal static site — deploy it to Render, Vercel, Netlify,
GitHub Pages, or any static host.

## Connecting to the backend

In `src/api/client.ts`, find:

```ts
export const API_BASE: string | null = null;
```

Set it to your deployed backend URL (e.g.
`'https://your-backend.onrender.com/api'`), then rebuild. Once set:

- Every section fetches live content from the API and replaces its default data
- Visitor pageviews (per section) and clicks (résumé, project links,
  certificates, contact, socials) are sent to `/api/track` for the admin
  Insights tab
- The footer's "Admin" link appears automatically, pointing at `{API_BASE}/admin`

If the API is ever unreachable, each section quietly keeps its default
content from `src/data/defaults.ts` — nothing breaks, and tracking calls
fail silently.

## Editing content without a backend

If you don't want to run the backend at all, just edit
`src/data/defaults.ts` directly — every section reads from there until
(unless) a live API is connected.

## Google Search Console

1. Go to https://search.google.com/search-console and add your site as a
   **URL prefix** property.
2. Choose the **HTML tag** verification method, copy the `content="..."` value.
3. Paste it into the `<meta name="google-site-verification">` tag in `index.html`.
4. Rebuild and deploy, then click **Verify**.
5. Update `public/robots.txt` and `public/sitemap.xml` with your real URL,
   then submit the sitemap under **Sitemaps** in Search Console.
