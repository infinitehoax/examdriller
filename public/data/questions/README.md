# Question Bank — Data Format

This folder is the entire "database." There is no backend; the app fetches these
JSON files at runtime (`fetch('/data/questions/manifest.json')` etc.) and
everything else (results, bookmarks, study plan, scores) lives in the browser's
`localStorage` — see `src/lib/storage.js`.

## Adding a new subject

1. Drop a new file in this folder, e.g. `chemistry.json`.
2. Add an entry to `manifest.json`:
   ```json
   { "code": "CHM", "name": "Chemistry", "file": "chemistry.json" }
   ```
3. That's it — the Practice setup screen, Classroom subject picker, and
   Question Search will all pick it up automatically on next load.

## File schema

```jsonc
{
  "subject": "Biology",          // display name
  "subjectCode": "BIO",          // short code, used in question IDs
  "years": [2023],               // years represented in this file (can have many)
  "topics": ["Cell Biology", ...], // flat list, used for topic filters
  "questions": [
    {
      "id": "BIO-2023-001",      // must be unique across the whole bank
      "year": 2023,
      "topic": "Cell Biology",   // must match an entry in `topics`
      "mode": "objective",       // "objective" | "theory"
      "text": "Question stem…",
      "difficulty": "easy",      // "easy" | "medium" | "hard" (optional, used in analytics)

      // --- objective mode only ---
      "options": [
        { "key": "A", "text": "…" },
        { "key": "B", "text": "…" },
        { "key": "C", "text": "…" },
        { "key": "D", "text": "…" }
      ],
      "correctOption": "B",
      "explanation": "Why B is correct, shown on the corrections screen.",

      // --- theory mode only ---
      "subparts": [
        { "id": "a", "text": "Sub-question text", "marks": 2 }
      ],
      "markScheme": "Free text mark scheme shown after submission."
    }
  ]
}
```

Notes:
- Objective questions are auto-graded client-side against `correctOption`.
- Theory questions are NOT auto-graded (no AI/backend yet) — the corrections
  screen shows the candidate's typed answer next to `markScheme` so the
  student can self-assess. This is a placeholder; wiring an LLM grader later
  is the obvious upgrade path (see `src/lib/grading.js` stub).
- LaTeX/chemistry formula rendering is stubbed in the Classroom and Science
  Note modules; real math typesetting (KaTeX/MathJax) is not yet wired in
  this scaffold.
- Keep `id` globally unique — bookmarks, result history, and leaderboard
  scoring all key off it.
