# manik.dev — portfolio

Personal site for **Manik Goyal** — backend & distributed systems engineer (Gurugram, IN).
One hand-written `index.html`. No framework, no bundler, no build step: what's in the repo is what ships.

**Live:** https://manik400.github.io/portfolio/ *(after the first deploy — see below)*

---

## What's in here

```
index.html                  the whole site — structure, CSS and JS in one file
404.html                    styled not-found page
favicon.svg                 MG monogram
robots.txt / sitemap.xml    indexing
.nojekyll                   tells Pages to serve files as-is (no Jekyll pass)
assets/                     drop a resume PDF here (see assets/.gitkeep)
.github/workflows/deploy.yml  publishes the repo root to GitHub Pages on push to main
LICENSE                     MIT for the code
```

Only external requests are Google Fonts (Archivo, Archivo Black, JetBrains Mono).
Everything else — layout, count-ups, theme toggle, pixel identicon — is inline and dependency-free.

## Run it locally

Open `index.html` in a browser, or serve it so relative paths behave exactly as on Pages:

```bash
python -m http.server 8080
```

Then http://localhost:8080.

## Deploy to GitHub Pages

This repo is wired for a **project site** at `https://manik400.github.io/portfolio/` — the canonical
link, `og:url`, JSON-LD `url` and `sitemap.xml` already carry that path.

```bash
gh repo create portfolio --public --source . --remote origin --push
```

Then, once: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Every later `git push` to `main` redeploys in about a minute; the run shows up under the Actions tab.

Moving to a **user site** (`https://manik400.github.io`, repo named `Manik400.github.io`) or a custom
domain later means changing that path in four places — `index.html` (canonical, `og:url`, JSON-LD),
`robots.txt`, `sitemap.xml`, and the `/portfolio/` links in `404.html`. For a custom domain, also add
a `CNAME` file containing the domain and point the DNS at GitHub.

Note: `robots.txt` is only read by crawlers at a domain root, so on a project site it is a no-op —
harmless, and correct the moment the site moves to a root domain.

## Editing the content

Everything is plain markup in `index.html`, top to bottom:

| Section | id | What it holds |
|---|---|---|
| Hero | `#top` | name, one-paragraph pitch, event-tail console |
| Deltas | `#deltas` | before → after rows; the numbers are the point |
| Systems | `#systems` | the fan-in/fan-out map + numbered ownership list |
| Builds | `#builds` | The Streamer, ParkNest |
| Toolbox | `#toolbox` | inventory table; `class="chip core"` = daily-use highlight |
| About | `#about` | ID card, bio, credentials, contact links |

- **Count-ups** animate to `data-count` and append `data-suffix`; the meter beside each row fills to `data-fill` (a percentage).
- **Theme** follows the OS by default; the `◑` button overrides it and stores the choice in `localStorage`.
- **Reduced motion** is respected — the tail, the marquee jitter and the count-ups fall back to static values.

## Two things to check before sharing widely

1. **The hero console is illustrative.** It prints sample event lines and jitters the events/sec
   readout around 500. It is labelled `SAMPLE` in the header and connected to nothing. Swap it for a
   frozen snapshot if even that reads as too live for you.
2. **Your phone number is on the ID card** (`#about` → `.idcard`, the `PHONE` row) — published
   deliberately. To pull it later, delete that one `<div class="idrow">`.

## Resume reconciliation

The three role-targeted resumes disagree in places; the site takes these positions:

- **Angular & React** both claimed for the 10+ npm libraries.
- **Kafka topics** credited with the 30 → 500+ events/sec win; RabbitMQ and MQTT named in the
  broker-agnostic module.
- **ParkNest** = .NET 8 + PostgreSQL + React.
- **Milvus and pgvector** both named for the vector work.
- Spring Boot/Java, Django, Go and C++ (outside The Streamer) sit in the toolbox, not claimed as daily.

Change any of these in `index.html` if a target role wants a different emphasis.
