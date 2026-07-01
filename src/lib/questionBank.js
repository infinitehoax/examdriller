// src/lib/questionBank.js
//
// The "database" is a folder of static JSON files under /public/data/questions.
// This module is the only place that fetches them, and caches results in
// memory for the session so switching screens doesn't re-fetch every time.

const BASE = '/data/questions';

let manifestCache = null;
const subjectCache = new Map();

export async function loadManifest() {
  if (manifestCache) return manifestCache;
  const res = await fetch(`${BASE}/manifest.json`);
  if (!res.ok) throw new Error(`Failed to load question manifest (${res.status})`);
  manifestCache = (await res.json()).subjects;
  return manifestCache;
}

export async function loadSubject(code) {
  if (subjectCache.has(code)) return subjectCache.get(code);
  const subjects = await loadManifest();
  const entry = subjects.find((s) => s.code === code);
  if (!entry) throw new Error(`Unknown subject code: ${code}`);
  const res = await fetch(`${BASE}/${entry.file}`);
  if (!res.ok) throw new Error(`Failed to load ${entry.file} (${res.status})`);
  const data = await res.json();
  subjectCache.set(code, data);
  return data;
}

export async function loadAllSubjects() {
  const subjects = await loadManifest();
  return Promise.all(subjects.map((s) => loadSubject(s.code)));
}

// Convenience: pull a filtered, flat question list across one or more subjects.
export async function getQuestions({ subjectCodes = [], topics = [], years = [], mode = null } = {}) {
  const subjects = await loadManifest();
  const codes = subjectCodes.length ? subjectCodes : subjects.map((s) => s.code);
  const banks = await Promise.all(codes.map((c) => loadSubject(c)));

  let questions = banks.flatMap((bank) =>
    bank.questions.map((q) => ({ ...q, subject: bank.subject, subjectCode: bank.subjectCode }))
  );

  if (topics.length) questions = questions.filter((q) => topics.includes(q.topic));
  if (years.length) questions = questions.filter((q) => years.includes(q.year));
  if (mode) questions = questions.filter((q) => q.mode === mode);

  return questions;
}

export async function getQuestionById(id) {
  const subjects = await loadManifest();
  for (const s of subjects) {
    const bank = await loadSubject(s.code);
    const found = bank.questions.find((q) => q.id === id);
    if (found) return { ...found, subject: bank.subject, subjectCode: bank.subjectCode };
  }
  return null;
}
