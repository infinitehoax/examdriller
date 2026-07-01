// src/lib/modules.js
//
// Single source of truth for "what modules exist." Adding a route here
// makes it appear in the sidebar AND as a dashboard tile, so navigation
// can never drift out of sync with the page registry.

export const MODULE_GROUPS = [
  {
    label: 'Practice',
    items: [
      { key: 'practice', label: 'Practice for WASSCE', icon: 'target', path: '/practice', tile: true,
        blurb: 'Objective & theory exam simulator' },
      { key: 'classroom', label: 'Classroom', icon: 'book', path: '/classroom', tile: true,
        blurb: 'Study material, by topic' },
      { key: 'search', label: 'Question Search', icon: 'search', path: '/search', tile: true,
        blurb: 'Find a question, explanation or topic' },
      { key: 'challenge', label: 'WASSCE Challenge', icon: 'flag', path: '/challenge', tile: true,
        blurb: 'Scheduled competitive mock exams' },
    ],
  },
  {
    label: 'Track',
    items: [
      { key: 'analysis', label: 'Performance Analysis', icon: 'chart', path: '/analysis', tile: true,
        blurb: 'Trends across subjects and topics' },
      { key: 'history', label: 'Result History', icon: 'history', path: '/history' },
      { key: 'studyplan', label: 'Study Plan', icon: 'calendar', path: '/study-plan', tile: true,
        blurb: 'Build your revision timetable' },
    ],
  },
  {
    label: 'Play',
    items: [
      { key: 'games', label: 'Educational Games', icon: 'game', path: '/games', tile: true,
        blurb: 'Fame Game, Millionaire, Math Rush, Map Game' },
      { key: 'leaderboard', label: 'Leaderboard', icon: 'trophy', path: '/leaderboard', tile: true,
        blurb: 'See how you rank' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { key: 'literature', label: 'WASSCE Literature Books', icon: 'feather', path: '/literature', tile: true,
        blurb: 'Prescribed texts, summarised' },
      { key: 'examiners', label: "Chief Examiners' Report", icon: 'report', path: '/examiners', tile: true,
        blurb: "Past WAEC examiners' comments" },
      { key: 'dictionary', label: 'Dictionary', icon: 'dictionary', path: '/dictionary', tile: true,
        blurb: 'Definitions & pronunciation' },
      { key: 'sciencenote', label: 'Science Note', icon: 'pencil', path: '/science-note', tile: true,
        blurb: 'Digital whiteboard for working' },
      { key: 'bookmarks', label: 'Bookmarks', icon: 'bookmark', path: '/bookmarks' },
    ],
  },
];

export const TOPBAR_LINKS = [
  { key: 'history', label: 'Result History', path: '/history' },
  { key: 'bookmarks', label: 'Bookmarks', path: '/bookmarks' },
  { key: 'leaderboard', label: 'Leaderboard', path: '/leaderboard' },
  { key: 'feedback', label: 'Feedback', path: '/feedback' },
  { key: 'sciencenote', label: 'Science Note', path: '/science-note' },
];

export function getAllTiles() {
  return MODULE_GROUPS.flatMap((g) => g.items.filter((i) => i.tile));
}

export function getAllNavItems() {
  return MODULE_GROUPS.flatMap((g) => g.items);
}
