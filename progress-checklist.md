### Phase 1: Backend & Authentication (Days 1–20)
*Currently, everything lives in `localStorage`. We need a database to allow cross-device syncing and user accounts. Using a Backend-as-a-Service (BaaS) like Supabase or Firebase is highly recommended for speed.*

**Days 1–5: Infrastructure & Auth Setup**
- [ ] - Day 1: Choose and set up your backend (e.g., Supabase, Firebase, or a custom Node/Express + PostgreSQL stack).
- [ ] - Day 2: Implement User Registration (Email/Password) in the frontend.
[ ] - Day 3: Implement User Login and Logout logic.
[ ] - Day 4: Implement Password Reset / Forgot Password flow.
[ ] - Day 5: Secure frontend routes (create a `<ProtectedRoute>` wrapper so unauthenticated users are redirected to login).

**Days 6–12: Database Schema Design**
[ ] - Day 6: Create the `Users` table (id, name, state, target_score, avatar_color).
[ ] - Day 7: Create the `Questions` and `Subjects` tables.
[ ] - Day 8: Create the `Results` table (to replace `storage.getResults()`).
[ ] - Day 9: Create the `Bookmarks` and `StudyPlan` tables.
[ ] - Day 10: Create the `ScienceNotes` table (storing Base64 image data or file URLs).
[ ] - Day 11: Set up Row Level Security (RLS) policies so users can only read/write their own data.
[ ] - Day 12: Write a backend script to parse your existing `public/data/questions/*.json` files and insert them into your new Database.

**Days 13–20: Rewiring the Frontend**
[ ] - Day 13: Refactor `src/lib/storage.js` -> Replace `getProfile()` with an API fetch to your DB.
[ ] - Day 14: Refactor `storage.addResult()` and `getResults()` to save to the DB.
[ ] - Day 15: Refactor `storage.toggleBookmark()` to update the DB.
[ ] - Day 16: Refactor Study Plan and Science Notes to sync to the cloud.
[ ] - Day 17: Update `src/lib/questionBank.js` to fetch questions from your new API/DB instead of static JSON.
[ ] - Day 18: Add loading states (spinners/skeletons) while fetching data from the network.
[ ] - Day 19: Add error handling (toast notifications) if network requests fail.
[ ] - Day 20: Buffer day for bug fixing and testing the new auth/database flow.

---

### Phase 2: Rich Content & Theory Grading (Days 21–45)
*The current app lacks proper math typesetting and images, and theory questions aren't auto-graded.*

**Days 21–27: Rich Text & Math Rendering**
[ ] - Day 21: Install and configure `KaTeX` or `MathJax` for React.
[ ] - Day 22: Update the `PracticeExam.jsx` to render LaTeX strings in question stems (e.g., fractions, quadratic equations).
[ ] - Day 23: Update the `Classroom.jsx` module to support rich markdown and LaTeX.
[ ] - Day 24: Add an image rendering component to handle diagrams in questions.
[ ] - Day 25: Upload sample diagrams to cloud storage and link them in your question DB.
[ ] - Day 26: Style the image/diagram containers in `Practice.css` so they are responsive.
[ ] - Day 27: Buffer day for QA on mobile screens.

**Days 28–35: Building an Internal Admin Panel**
[ ] - Day 28: Set up a `/admin` route (restricted to your admin email only).
[ ] - Day 29: Build a UI to Add/Edit/Delete Subjects and Topics.
[ ] - Day 30: Build a UI to Add/Edit Objective Questions (with a markdown/LaTeX previewer).
[ ] - Day 31: Build a UI to Add/Edit Theory Questions.
[ ] - Day 32: Build a UI to upload images to cloud storage and get URLs for questions.
[ ] - Day 33: Build an interface to add Examiner Reports data directly.
[ ] - Day 34: Build an interface to add Literature Book summaries.
[ ] - Day 35: Spend the day using your admin panel to add 50 real WASSCE questions.

**Days 36–45: AI Theory Auto-Grading**
[ ] - Day 36: Create a secure backend endpoint `/api/grade-theory` (never put LLM API keys in the React app).
[ ] - Day 37: Write an Anthropic or OpenAI prompt template that compares a user's answer to the `markScheme`.
[ ] - Day 38: Update `PracticeResult.jsx` to show a "Grade with AI" button for theory attempts.
[ ] - Day 39: Wire the frontend button to your secure backend endpoint.
[ ] - Day 40: Parse the AI response to display awarded marks (e.g., 2/5 marks) and feedback.
[ ] - Day 41: Save the AI-graded result to the database.
[ ] - Day 42: Refine the AI prompt to prevent "jailbreaks" or overly lenient grading.
[ ] - Day 43: Update Performance Analysis charts to include theory scores.
[ ] - Day 44: Add a warning banner: "AI grading is experimental and may make mistakes."
[ ] - Day 45: Buffer day.

---

### Phase 3: AI Tutor & Reference Tools (Days 46–65)
*Turning Clara into a real tutor and fixing up the stubbed reference modules.*

**Days 46–52: Clara the AI Tutor**
[ ] - Day 46: Set up an edge function/backend route for `/api/chat`.
[ ] - Day 47: Implement an LLM stream response (Server-Sent Events) so Clara types out her replies.
[ ] - Day 48: Replace `fakeReply()` in `AiTutor.jsx` with the real streaming API.
[ ] - Day 49: Inject user context into the system prompt (e.g., "User is a Nigerian student studying for WASSCE. Their weakest subject is Biology.").
[ ] - Day 50: Give Clara a "Tool" or RAG capability to search the `Questions` database to provide relevant examples.
[ ] - Day 51: Save chat history to the database so conversations persist across sessions.
[ ] - Day 52: Add markdown rendering to Clara's chat bubbles (for bolding and math formulas).

**Days 53–65: Upgrading Reference Tools**
[ ] - Day 53: Find a free Dictionary API (e.g., Free Dictionary API) or Oxford Dictionary API.
[ ] - Day 54: Replace the hardcoded `SEED` in `Dictionary.jsx` with real API calls.
[ ] - Day 55: Update `ScienceNote.jsx`: Add a "Text Box" insertion tool.
[ ] - Day 56: Update `ScienceNote.jsx`: Add a basic "Graph Plotter" (using a library like `function-plot`).
[ ] - Day 57: Update `ExaminersReport.jsx` to fetch reports from your database.
[ ] - Day 58: Update `Literature.jsx` to fetch book summaries from your database.
[ ] - Day 59: Implement the "Listen" (Text-to-Speech) API better across the app using a cloud TTS if browser TTS is buggy.
[ ] - Day 60: Review mobile UI for the Science Note canvas (fix touch scrolling issues).
[ ] - Day 61-65: Source real WAEC content (Past questions, literature summaries) and enter them via your Admin panel.

---

### Phase 4: Gamification & Multiplayer (Days 66–95)
*Making the app sticky, competitive, and fun.*

**Days 66–75: Global Leaderboards**
[ ] - Day 66: Create a Trophy.so account (or build custom backend tables for Streaks/Scores).
[ ] - Day 67: Wire `submitExam()` to send real scores to the Trophy.so/Custom API.
[ ] - Day 68: Update `Leaderboard.jsx` to fetch real global rankings instead of local `SEEDED_RIVALS`.
[ ] - Day 69: Add "State Level" filtering to the leaderboard (e.g., Rank in Lagos vs. Global).
[ ] - Day 70: Implement User Streaks (e.g., "3 Day Study Streak!").
[ ] - Day 71: Show the streak counter in the `TopBar` UI.
[ ] - Day 72: Design and implement 5 badges (e.g., "First 100%", "Night Owl", "Math Whiz").
[ ] - Day 73: Create a UI in `Profile.jsx` to display earned badges.
[ ] - Day 74: Wire badge unlocking logic to the backend.
[ ] - Day 75: Buffer day.

**Days 76–85: The Games Engine**
[ ] - Day 76: Update `FameGame.jsx` to fetch questions dynamically from the remote DB.
[ ] - Day 77: Update `MillionaireGame.jsx` to fetch questions dynamically.
[ ] - Day 78: Implement the "Ask the Audience" lifeline (generate weighted random percentages favoring the correct answer).
[ ] - Day 79: Implement the "Phone a Friend" lifeline (Have the AI Tutor generate a conversational hint).
[ ] - Day 80: Map Game: Download SVG TopoJSON files for Africa and the World.
[ ] - Day 81: Write a parser to convert SVG paths into clickable React components.
[ ] - Day 82: Implement the "Find the Country" logic for the Map Game.
[ ] - Day 83: Implement the "Find the Capital" logic.
[ ] - Day 84: Add high-score saving to the games.
[ ] - Day 85: Buffer day.

**Days 86–95: WASSCE Challenge (Live Mocks)**
[ ] - Day 86: Build the backend schema for `Challenges` (start_time, end_time, subject_ids).
[ ] - Day 87: Update `Challenge.jsx` to fetch upcoming challenges from the DB.
[ ] - Day 88: Add a "Register/Enroll" button for upcoming challenges.
[ ] - Day 89: Build a countdown timer page for when a challenge is about to begin.
[ ] - Day 90: Implement strict server-side timestamp validation (so users can't cheat the timer).
[ ] - Day 91: Build a real-time post-exam leaderboard using WebSockets (or Supabase Realtime).
[ ] - Day 92: Add push notifications/emails to remind users 1 hour before a Challenge starts.
[ ] - Day 93-95: Conduct a test Challenge with friends/family to stress-test the flow.

---

### Phase 5: Monetization & Polish (Days 96–125)
*Turning the app into a business.*

**Days 96–105: Paystack Integration (Monetization)**
[ ] - Day 96: Set up a Paystack business account (ideal for Nigerian/WAEC market).
[ ] - Day 97: Define free tier vs. premium tier (e.g., Free = 2018-2020 questions, Premium = All years + AI Tutor).
[ ] - Day 98: Add a `subscription_status` column to the `Users` table.
[ ] - Day 99: Build a beautiful "Upgrade to Premium" pricing page.
[ ] - Day 100: Integrate the Paystack React wrapper for checkout.
[ ] - Day 101: Set up a secure backend webhook to listen for successful Paystack payments.
[ ] - Day 102: Update the DB subscription status upon webhook success.
[ ] - Day 103: Implement UI locks (padlock icons) on premium subjects/features.
[ ] - Day 104: Test the payment flow extensively using Paystack Test Keys.
[ ] - Day 105: Buffer day.

**Days 106–115: State Management & Offline Support (PWA)**
[ ] - Day 106: Install and configure `React Query` (TanStack Query) to handle API caching and background fetching.
[ ] - Day 107: Replace standard `useEffect` fetches with `useQuery` across the app to eliminate flicker.
[ ] - Day 108: Configure `vite-plugin-pwa` to turn the app into a Progressive Web App.
[ ] - Day 109: Generate App Icons and an offline `manifest.json`.
[ ] - Day 110: Cache the `TopBar`, `Sidebar`, and static assets via Service Workers.
[ ] - Day 111: Implement logic to cache a user's recent question bank so they can practice offline.
[ ] - Day 112: Implement an "Offline Sync" queue (if they finish an exam offline, upload results when WiFi returns).
[ ] - Day 113: Add an "Install App" button to the Dashboard for mobile users.
[ ] - Day 114-115: Test offline behavior (turn off WiFi, take a test, turn WiFi back on).

**Days 116–125: Performance & UX Refinement**
[ ] - Day 116: Audit the app for accessibility (aria-labels, contrast ratios).
[ ] - Day 117: Implement keyboard navigation throughout modals and dropdowns.
[ ] - Day 118: Code Splitting: Lazy load the Games and AI Tutor modules using `React.lazy()` to reduce initial bundle size.
[ ] - Day 119: Optimize Recharts (Performance Analysis) for mobile viewports.
[ ] - Day 120: Add empty states/illustrations where data is missing.
[ ] - Day 121: Set up a proper 404 page with a search bar.
[ ] - Day 122: Add subtle CSS animations/transitions for page routing.
[ ] - Day 123-125: Comprehensive UI review (padding, typography consistency against `tokens.css`).

---

### Phase 6: Production Readiness & Launch (Days 126–150)
*Securing the app, adding analytics, and preparing for real users.*

**Days 126–135: Testing & QA**
[ ] - Day 126: Set up `Vitest` and React Testing Library.
[ ] - Day 127: Write unit tests for the grading logic (`submitExam` function).
[ ] - Day 128: Write unit tests for the `safeEvaluate` function in the Calculator.
[ ] - Day 129: Set up `Playwright` or `Cypress` for End-to-End (E2E) testing.
[ ] - Day 130: Write an E2E test for the Login -> Select Subject -> Take Exam -> View Result flow.
[ ] - Day 131: Write an E2E test for the Paystack upgrade flow (using test cards).
[ ] - Day 132: Ask 5 friends to Beta Test the app and break it.
[ ] - Day 133: Fix Beta bugs: Round 1.
[ ] - Day 134: Fix Beta bugs: Round 2.
[ ] - Day 135: Buffer day.

**Days 136–145: Analytics, SEO & Security**
[ ] - Day 136: Integrate PostHog, Google Analytics, or Vercel Web Analytics.
[ ] - Day 137: Track custom events (e.g., `Exam_Started`, `Subscribed_Premium`, `AI_Tutor_Used`).
[ ] - Day 138: Integrate Sentry or LogRocket for frontend crash reporting.
[ ] - Day 139: Update `index.html` with proper meta tags, OpenGraph tags, and Twitter cards for SEO/Sharing.
[ ] - Day 140: Set up rate limiting on your backend API to prevent DDoS or spam.
[ ] - Day 141: Audit backend for CORS security (only allow requests from your specific domain).
[ ] - Day 142: Ensure `.env` variables are properly separated between Dev, Staging, and Production.
[ ] - Day 143: Create a Landing Page (outside the SPA) to market the features to students and parents.
[ ] - Day 144: Add Terms of Service and Privacy Policy pages.
[ ] - Day 145: Add a "Contact Support" widget or email integration.

**Days 146–150: The Final Launch**
[ ] - Day 146: Purchase a domain name (e.g., `testdriller.app` or `.com.ng`).
[ ] - Day 147: Connect the domain to your hosting provider (Render/Vercel/Netlify) and set up SSL/HTTPS.
[ ] - Day 148: Do a final production walkthrough (register a live account, make a live payment).
[ ] - Day 149: Prepare your launch assets (Screenshots, demo video, Twitter/Nairaland post).
[ ] - Day 150: **LAUNCH!** Share with WAEC/JAMB student groups, forums, and your network.
