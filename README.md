# manik.dev — portfolio

Personal site for **Manik Goyal** — backend & distributed systems engineer (Gurugram, IN).
One hand-written `index.html`. No framework, no bundler, no build step: what's in the repo is what ships.

**Live:** https://manik400.github.io/portfolio/ *(after the first deploy — see below)*

---

## What's in here

```
index.html                  the default UI (Throughput) — structure, CSS and JS in one file
ui/                         eight alternate page designs (see "UIs" below)
demo.html                   interactive simulations: booking race, bulk enrollment, vector dedup
common.js                   shared runtime: UI picker, language engine for the alternates, theme helper
i18n.js                     translations (de, nl, fi, es, ja, th) + the timezone → language map
404.html                    styled not-found page
favicon.svg                 MG monogram
robots.txt / sitemap.xml    indexing
.nojekyll                   tells Pages to serve files as-is (no Jekyll pass)
assets/                     Manik_Goyal_Resume.pdf — served by the ↓ Résumé buttons
.github/workflows/deploy.yml  publishes the repo root to GitHub Pages on push to main
LICENSE                     MIT for the code
```

Only external requests are Google Fonts (Archivo, Archivo Black, JetBrains Mono).
Everything else — layout, count-ups, theme toggle, pixel identicon, language switching — is inline
(or in `i18n.js`) and dependency-free.

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
| Hero | `#top` | event-tail console on the left, name and pitch on the right (mirrored at ≥1000px; stacks name-first on mobile) |
| At a glance | `#glance` | the recruiter/interviewer fact sheet: 8 fact cards (role, experience, stack, domain, looking for, education, languages) + a 7-question Q&A whose answers link deeper into the page |
| Deltas | `#deltas` | before → after rows; the numbers are the point |
| Systems | `#systems` | the fan-in/fan-out map + numbered ownership list |
| Builds | `#builds` | The Streamer, ParkNest — each with an inline SVG plate and source / live links |
| Toolbox | `#toolbox` | inventory table; `class="chip core"` = daily-use highlight |
| About | `#about` | ID card, bio, credentials, contact links |

- **Count-ups** animate to `data-count` and append `data-suffix`; the meter beside each row fills to `data-fill` (a percentage).
- **Theme** follows the OS by default; the `◑` button overrides it and stores the choice in `localStorage`.
- **UIs.** Nine complete page designs sharing one content dictionary. `index.html` is Throughput
  (default); the others live in `ui/`: `terminal` (a shell — type `help`), `editorial` (magazine
  profile + TOC), `dossier` (typed case file with stamps), `newspaper` (broadsheet front page),
  `transit` (metro map), `paper` (two-column academic paper), `passport` (data page + visa stamps per
  target country), `desktop` (retro OS with draggable windows). The floating **UI** button
  (bottom-right, from `common.js`) opens a picker with a thumbnail of each; the choice is stored in
  `localStorage` (`mg-ui`) and `index.html` forwards to it on the next visit (`?stay=1` disables
  that, `?ui=passport` selects one via URL). Every page uses the same `data-i18n` keys, so all seven
  languages work everywhere — alternates call `MG.lang()` from `common.js`. They carry `noindex` + a
  canonical to `/portfolio/`. All are responsive down to 360px. To add a UI: copy any file in
  `ui/`, keep `<html data-ui="name" data-root="../">`, the two script tags and `MG.lang()`, then add
  an entry (id, file, name, tag, thumbnail class) to `UIS` in `common.js`.
- **Live demo** (`demo.html`, linked from the nav and the UI picker). Three client-side simulations:
  (1) the ParkNest booking race — Alice and Bob book the same slot at once; toggle optimistic
  concurrency to see the 409 vs the silent double-booking, and retry a payment with the same
  idempotency key to see the ledger refuse a second charge; (2) bulk enrollment — generate a
  5,000-row sheet with ~1.8% broken rows, run it through field-level validation with SignalR-style
  progress events, download `rejects.csv`; (3) vector-search dedup — click to enroll embeddings,
  drag the similarity threshold, toggle the product-quantised index for the −75% memory trade-off.
  Deliberately *not* the Kafka/event-pipeline work. Data is generated in the browser; the honest
  framing note at the bottom of the page should stay.
- **SEO.** Descriptive `<title>` and description, `robots`, `geo.*`, `hreflang` alternates for the
  seven `?lang=` variants, Open Graph `profile` + `og:image` (`og.png`, 1200×630, generated with
  Pillow — regenerate if the numbers change), Twitter large card, and JSON-LD with `Person`
  (occupation, skills, languages, `seeks`), `WebSite`, `ProfilePage` and a `FAQPage` mirroring the
  at-a-glance Q&A. Bump `dateModified` in the JSON-LD and `lastmod` in `sitemap.xml` on content changes.
- **Reduced motion** is respected — the tail, the marquee jitter and the count-ups fall back to static values.
- **The résumé** is `assets/Manik_Goyal_Resume.pdf`, linked from the nav, the hero and the contact
  list. Replacing that one file updates all three — keep the filename, or change it in the three
  `href`/`download` pairs.
- **Build-card plates** are inline `<svg>` drawn in the page's own palette variables, so they follow
  the light/dark toggle. Geometry lives in a 560×196 viewBox; the card scales it to its width.
- **The typewriter** runs on the hero paragraphs and every section intro, firing when each one
  scrolls into view. It walks text nodes rather than rewriting `innerHTML`, so the highlight spans
  and bold runs survive and type out in place. The caret is a block that cycles red → amber → green.
  Because the text starts emptied, a watchdog writes the full paragraph out if rAF stalls while the
  page is visible, and `prefers-reduced-motion` skips the whole thing — the text just sits there.
- **Languages.** The page ships in English (the markup) plus German, Dutch, Finnish, Spanish,
  Japanese and Thai, all in `i18n.js`. Every translatable element carries `data-i18n="key"`; the
  script remembers each element's English `innerHTML` and swaps in the dictionary value for that key,
  falling back to English when a key is missing (proper nouns like GITHUB are missing on purpose).
  Values are HTML strings, so highlight spans and bold runs survive translation.
  - **Detection order:** `?lang=de` in the URL → the choice saved from the dropdown (`localStorage`)
    → the visitor's timezone (`Europe/Berlin` → `de`, `Asia/Tokyo` → `ja`, Spanish-speaking Americas
    → `es`, …; the map is `MG_I18N.tz`) → the browser's language list → English.
  - **The dropdown** is the `⌖ EN ▾` control at the far right of the nav: a native `<select>` laid
    invisibly over a styled label, so it works with keyboard, screen readers and on phones.
    Under 560px the nav's résumé button hides to make room (the hero has one too).
  - **Editing English** in `index.html` does not update the other languages — change the same key in
    `i18n.js`. Adding a language = one more object in `strings` (copy `de`, translate the 142 keys),
    one `<option>` in the nav, and optionally timezones in `tz`.
  - Switching language re-runs the typewriter on any paragraph already on screen; the console
    log lines, the SVG plate labels and the résumé PDF stay English.
- **The cursor** is a reticle drawn as an inline SVG data URI, with a dark halo under a light stroke
  so it reads on either theme. Its centre marker changes colour by context: red while reading, amber
  over anything clickable, green over the console, the map and the build plates. Fine pointers only
  (`@media (hover:hover) and (pointer:fine)`), and every rule keeps a keyword fallback.

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
