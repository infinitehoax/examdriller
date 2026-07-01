// src/lib/leaderboard.js
//
// THE LEADERBOARD PROBLEM:
// A real cross-device leaderboard needs a server, because every other
// student's score has to live somewhere everyone can read it. This app has
// no backend, so right now "the leaderboard" is: (a) the current device's
// own scores, recorded via storage.recordLeaderboardScore, displayed
// alongside (b) a small set of realistic seeded rivals, so the screen isn't
// empty on a fresh install. This is clearly a placeholder, not a real
// global ranking.
//
// UPGRADE PATH — Trophy (trophy.so):
// Trophy is a hosted gamification API (streaks, points, achievements,
// leaderboards) with an MIT-licensed React UI kit (ui.trophy.so) whose
// components accept plain props, so they work with ANY data source —
// including the local data this file already produces. That means the UI
// layer (see src/pages/Leaderboard.jsx) is written today in the same
// shape Trophy's <LeaderboardRankings> component expects:
//
//   { userId, userName, rank, value, byline, avatarUrl }
//
// so swapping the data source later is a one-function change, not a UI
// rewrite:
//
//   1. npm install @trophyso/node (server-side only — needs an API key,
//      so this must move into a real backend, e.g. a Render web service).
//   2. On exam/game submit, call:
//        await trophy.metrics.event('exam-score', { user: { id }, value: score })
//      instead of (or in addition to) storage.recordLeaderboardScore(...).
//   3. Replace getLocalLeaderboard() below with:
//        const { rankings } = await trophy.leaderboards.get('exam-score')
//   4. `npx shadcn add` the Trophy UI leaderboard components from
//      ui.trophy.so and drop the local <LeaderboardRow> markup for them.
//
// Nothing else in the app needs to change because the row shape is
// already Trophy-compatible.

import { storage } from './storage';

const SEEDED_RIVALS = [
  { userId: 'seed-1', userName: 'Chidinma O.', state: 'Lagos', byline: 'Lagos State', value: 0 },
  { userId: 'seed-2', userName: 'Tunde A.', state: 'Oyo', byline: 'Oyo State', value: 0 },
  { userId: 'seed-3', userName: 'Amara K.', state: 'Rivers', byline: 'Rivers State', value: 0 },
  { userId: 'seed-4', userName: 'Ifeoma N.', state: 'Anambra', byline: 'Anambra State', value: 0 },
  { userId: 'seed-5', userName: 'Bashir M.', state: 'Kano', byline: 'Kano State', value: 0 },
];

// Deterministic pseudo-scores per category so the seeded board feels stable
// across reloads instead of jumping around randomly.
function seedScore(seedKey, category) {
  let hash = 0;
  const str = seedKey + category;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return 55 + (hash % 45); // 55–99 range, plausible exam/game scores
}

export function getLocalLeaderboard({ category = 'exam-practice', subject = 'all' } = {}) {
  const profile = storage.getProfile();
  const scores = storage.getLeaderboardScores().filter((s) => s.category === category && (subject === 'all' || s.subject === subject));

  const myBest = scores.reduce((max, s) => Math.max(max, s.value), 0);

  const rivals = SEEDED_RIVALS.map((r) => ({ ...r, value: seedScore(r.userId, category + subject) }));

  const me = {
    userId: 'me',
    userName: profile.name || 'You',
    byline: profile.state ? `${profile.state} State` : 'Set your profile',
    value: myBest,
    isCurrentUser: true,
  };

  const all = [...rivals, me].sort((a, b) => b.value - a.value);
  return all.map((row, i) => ({ ...row, rank: i + 1 }));
}

export const LEADERBOARD_CATEGORIES = [
  { key: 'exam-practice', label: 'Exam Practice' },
  { key: 'millionaire-game', label: 'Millionaire Game' },
  { key: 'fame-game', label: 'Fame Game (60s)' },
  { key: 'math-rush', label: 'Math Rush' },
];
