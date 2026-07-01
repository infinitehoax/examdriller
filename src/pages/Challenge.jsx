// src/pages/Challenge.jsx
import React from 'react';
import { PageHeader, Card, Stub } from '../components/Shared';

const ROUNDS = [
  { id: 1, date: '2026-06-28', subjects: ['Biology', 'Chemistry'], status: 'upcoming' },
  { id: 2, date: '2026-07-05', subjects: ['Mathematics', 'Physics'], status: 'upcoming' },
  { id: 3, date: '2026-06-14', subjects: ['English Language'], status: 'completed', topScore: 92 },
];

export default function Challenge() {
  return (
    <div>
      <PageHeader eyebrow="WASSCE CHALLENGE" title="Scheduled mock rounds" description="Competitive, timed mock exams that the whole cohort sits together." />
      <Stub moduleName="Challenge scheduling & scoreboard" blurb="Rounds are seeded statically here. Real scheduling needs a backend to coordinate start times and collect scores across users — currently each 'round' would just be a normal local practice exam taken at the scheduled time.">
        {ROUNDS.map((r) => (
          <Card key={r.id} style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Round {r.id} — {r.subjects.join(', ')}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{new Date(r.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</div>
            </div>
            {r.status === 'completed' ? (
              <span className="pill pill-gold mono">Top score: {r.topScore}%</span>
            ) : (
              <span className="pill pill-default">Upcoming</span>
            )}
          </Card>
        ))}
      </Stub>
    </div>
  );
}
