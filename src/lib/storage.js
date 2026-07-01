// src/lib/storage.js
//
// TestDriller has no backend. Every piece of mutable app state — results,
// bookmarks, study plan, science notes, profile, notifications, leaderboard
// scores — lives in localStorage under namespaced keys below. This file is
// the ONLY place that should touch window.localStorage directly, so the
// storage strategy can change later (e.g. to IndexedDB or a real API)
// without touching every component.

const NS = 'testdriller:';

const KEYS = {
  profile: 'profile',
  results: 'results',           // array of completed exam attempts
  bookmarks: 'bookmarks',       // array of question IDs
  studyPlan: 'studyPlan',       // { entries: [...] }
  scienceNotes: 'scienceNotes', // array of saved canvases
  notifications: 'notifications',
  leaderboardScores: 'leaderboardScores', // local participation in mock leaderboard
  classroomProgress: 'classroomProgress', // { [subjectCode]: { completion, timeSpent, ... } }
};

function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(NS + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`storage: failed to read "${key}"`, err);
    return fallback;
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(NS + key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`storage: failed to write "${key}"`, err);
    return false;
  }
}

export const storage = {
  KEYS,

  // ---- profile ----
  getProfile() {
    return read(KEYS.profile, {
      name: '',
      email: '',
      phone: '',
      country: 'Nigeria',
      state: '',
      school: '',
      subjects: [],
      avatarColor: '#0B3D2E',
    });
  },
  setProfile(profile) {
    return write(KEYS.profile, profile);
  },

  // ---- exam results ----
  getResults() {
    return read(KEYS.results, []);
  },
  addResult(result) {
    const results = storage.getResults();
    results.unshift({ ...result, id: result.id || crypto.randomUUID(), takenAt: new Date().toISOString() });
    write(KEYS.results, results);
    return results;
  },
  deleteResult(id) {
    const results = storage.getResults().filter((r) => r.id !== id);
    write(KEYS.results, results);
    return results;
  },

  // ---- bookmarks ----
  getBookmarks() {
    return read(KEYS.bookmarks, []);
  },
  toggleBookmark(questionId) {
    const bookmarks = storage.getBookmarks();
    const idx = bookmarks.indexOf(questionId);
    if (idx === -1) bookmarks.push(questionId);
    else bookmarks.splice(idx, 1);
    write(KEYS.bookmarks, bookmarks);
    return bookmarks;
  },

  // ---- study plan ----
  getStudyPlan() {
    return read(KEYS.studyPlan, { entries: [] });
  },
  setStudyPlan(plan) {
    return write(KEYS.studyPlan, plan);
  },

  // ---- science notes ----
  getScienceNotes() {
    return read(KEYS.scienceNotes, []);
  },
  saveScienceNote(note) {
    const notes = storage.getScienceNotes();
    notes.unshift({ ...note, id: note.id || crypto.randomUUID(), savedAt: new Date().toISOString() });
    write(KEYS.scienceNotes, notes);
    return notes;
  },

  // ---- notifications ----
  getNotifications() {
    return read(KEYS.notifications, [
      {
        id: 'welcome',
        title: 'Welcome to TestDriller',
        body: 'Set up your profile and pick your subject combination to get started.',
        read: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  },
  markNotificationRead(id) {
    const list = storage.getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
    write(KEYS.notifications, list);
    return list;
  },

  // ---- classroom progress ----
  getClassroomProgress() {
    return read(KEYS.classroomProgress, {});
  },
  setClassroomProgress(subjectCode, progress) {
    const all = storage.getClassroomProgress();
    all[subjectCode] = { ...all[subjectCode], ...progress };
    write(KEYS.classroomProgress, all);
    return all;
  },

  // ---- leaderboard (local-only participation; see lib/leaderboard.js) ----
  getLeaderboardScores() {
    return read(KEYS.leaderboardScores, []);
  },
  recordLeaderboardScore(entry) {
    const scores = storage.getLeaderboardScores();
    scores.push({ ...entry, recordedAt: new Date().toISOString() });
    write(KEYS.leaderboardScores, scores);
    return scores;
  },

  // ---- escape hatch ----
  clearAll() {
    Object.values(KEYS).forEach((k) => window.localStorage.removeItem(NS + k));
  },
};
