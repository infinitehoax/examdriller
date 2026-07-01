# TestDriller — Web Scaffold

A WASSCE exam-prep app scaffold: React + Vite, **no backend**. The question
bank is static JSON (acting as the "database"), and every other piece of
state (results, bookmarks, study plan, profile, leaderboard) lives in the
browser's `localStorage`.

This is a **breadth-first scaffold**, per the brief: every module from the
PRD has working navigation and a real screen, but only a few are built out
deep (Practice/Exam Simulator, Classroom, Search, Bookmarks, History,
Analysis, Study Plan, Science Note, Math Rush). The rest are clearly marked
with an in-app banner ("X is scaffolded — …") explaining exactly what's
stubbed and what the next step would be.

## Architecture

```
public/data/questions/        ← the "database": one JSON file per subject
  manifest.json                 lists which subjects exist
  biology.json, mathematics.json, english.json
  README.md                     full schema docs — read this before adding real data

src/lib/
  questionBank.js              fetches & caches the JSON files
  storage.js                   the ONLY file that touches localStorage directly
  leaderboard.js               local leaderboard now; documents the Trophy.so upgrade path
  modules.js                   single source of truth for sidebar nav + dashboard tiles

src/components/                shared layout (sidebar/topbar) + UI primitives
src/pages/                     one file per module; src/pages/games/ for the 4 games
```

## Adding real question data

Don't touch any component code. Just edit JSON:

1. Open `public/data/questions/README.md` for the exact schema.
2. Add `public/data/questions/<subject>.json` following that schema.
3. Add one line to `public/data/questions/manifest.json`.

Practice setup, Classroom, Question Search, and Bookmarks all pick up new
subjects automatically.

## Local development

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

## Deploying to Render (free tier)

This ships as a **Static Site** — no server process, no cold starts, no
sleep on Render's free tier.

**Option A — one click via `render.yaml`:**
1. Push this repo to GitHub.
2. In Render: New → Blueprint → point at the repo. `render.yaml` in the
   root configures everything (build command, publish path, SPA rewrite).

**Option B — manual:**
1. New → Static Site → connect the repo.
2. Build command: `npm install && npm run build`
3. Publish directory: `dist`
4. Add a rewrite rule `/* → /index.html` (required for React Router routes
   like `/practice` to work on refresh/direct link).

## What's stubbed vs. real (honesty list)

| Module | Status |
|---|---|
| Practice / Exam Simulator (objective + theory) | **Real** — timer, keyboard shortcuts, nav grid, corrections, grade bands |
| Classroom | Real navigation + content viewer + Listen (Web Speech API); rich text/LaTeX rendering not wired |
| Question Search | **Real** — searches the actual JSON bank |
| Bookmarks | **Real** — localStorage + JSON lookup |
| Result History / Performance Analysis | **Real** — charts over localStorage results |
| Study Plan | **Real** — add/remove timetable entries, overdue detection |
| Science Note | **Real** drawing/eraser/undo/clear/save; text & graph plotting not wired |
| Math Rush | **Fully playable** |
| Fame Game / Millionaire Game | Playable with real questions; some lifelines (audience/phone-a-friend/switch) are visual-only |
| Map Game | Playable demo for Nigeria only (5 states); other 6 geographies need real SVG topology |
| Leaderboard | Local-only ranking + seeded names; rows are pre-shaped for a Trophy.so swap (see `src/lib/leaderboard.js`) |
| AI Tutor (Clara) | Chat UI works; replies are canned, not a real LLM call |
| WASSCE Literature Books / Chief Examiners' Report / WASSCE Challenge | Scaffolded with 1–3 sample entries each; clearly marked, easy to extend |

## Known limitations (by design, given "no backend")

- **Single device only.** Nothing here syncs across devices/browsers — that's
  what localStorage means. A real account system needs a backend.
- **Theory questions aren't auto-graded.** No AI grader is wired in; the
  corrections screen just shows the typed answer next to the mark scheme.
- **Leaderboard is local.** Real cross-user ranking needs a server (Trophy.so
  is the suggested path — see the in-app note on the Leaderboard page).
