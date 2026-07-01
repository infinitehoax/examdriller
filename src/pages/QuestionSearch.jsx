// src/pages/QuestionSearch.jsx
import React, { useEffect, useState } from 'react';
import { PageHeader, Card, EmptyState } from '../components/Shared';
import { loadManifest, loadAllSubjects } from '../lib/questionBank';

const SCOPES = ['Everywhere', 'Question', 'Explanation', 'Topic'];

export default function QuestionSearch() {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('Everywhere');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);

  useEffect(() => {
    (async () => {
      const subs = await loadManifest();
      setSubjects(subs);
      const banks = await loadAllSubjects();
      setAllQuestions(banks.flatMap((b) => b.questions.map((q) => ({ ...q, subject: b.subject, subjectCode: b.subjectCode }))));
    })();
  }, []);

  function matches(q) {
    if (selectedSubjects.length && !selectedSubjects.includes(q.subjectCode)) return false;
    if (!query.trim()) return true;
    const needle = query.toLowerCase();
    const fields = scope === 'Everywhere'
      ? [q.text, q.explanation, q.markScheme, q.topic]
      : scope === 'Question' ? [q.text]
      : scope === 'Explanation' ? [q.explanation, q.markScheme]
      : [q.topic];
    return fields.filter(Boolean).some((f) => f.toLowerCase().includes(needle));
  }

  const results = allQuestions.filter(matches);

  return (
    <div>
      <PageHeader eyebrow="QUESTION SEARCH" title="Find a question" description="Search across the question bank by question text, explanation, or topic." />

      <Card style={{ marginBottom: 18 }}>
        <input
          autoFocus
          placeholder="Search e.g. 'mitochondrion', 'pollination', 'profit'…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: '100%', padding: '12px 14px', fontSize: 15, border: '1px solid var(--line)', borderRadius: 4, marginBottom: 14 }}
        />
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="chip-row">
            {SCOPES.map((s) => (
              <button key={s} className={'chip chip-small' + (scope === s ? ' chip-active' : '')} onClick={() => setScope(s)}>{s}</button>
            ))}
          </div>
          <div className="chip-row">
            {subjects.map((s) => (
              <button
                key={s.code}
                className={'chip chip-small' + (selectedSubjects.includes(s.code) ? ' chip-active' : '')}
                onClick={() => setSelectedSubjects((prev) => prev.includes(s.code) ? prev.filter((c) => c !== s.code) : [...prev, s.code])}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {results.length === 0 ? (
        <EmptyState title="No matches" body="Try a different keyword or widen your subject filter." />
      ) : (
        results.map((q) => (
          <Card key={q.id} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <span className="pill pill-default">{q.subject}</span>
              <span className="pill pill-gold">{q.topic}</span>
              <span className="pill pill-default mono">{q.id}</span>
            </div>
            <div style={{ fontSize: 14 }}>{q.text}</div>
          </Card>
        ))
      )}
    </div>
  );
}
