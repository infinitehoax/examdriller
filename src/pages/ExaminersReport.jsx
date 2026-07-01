// src/pages/ExaminersReport.jsx
import React, { useState } from 'react';
import { PageHeader, Card, Stub } from '../components/Shared';

const REPORTS = [
  {
    subject: 'Biology', year: 2023,
    weaknesses: 'Candidates struggled with labelling diagrams accurately and confused mitosis with meiosis stages.',
    strengths: 'Most candidates handled definitions and straightforward recall questions well.',
    general: 'Performance was generally average, with a notable drop in scores on practical/alternative-to-practical questions.',
  },
  {
    subject: 'Mathematics', year: 2023,
    weaknesses: 'Word problems involving simultaneous equations and circle theorems were poorly attempted.',
    strengths: 'Basic arithmetic and simplification questions were well answered.',
    general: 'A wide performance gap was observed between objective and theory sections.',
  },
];

export default function ExaminersReport() {
  const [subject, setSubject] = useState('All');
  const subjects = ['All', ...new Set(REPORTS.map((r) => r.subject))];
  const filtered = subject === 'All' ? REPORTS : REPORTS.filter((r) => r.subject === subject);

  return (
    <div>
      <PageHeader eyebrow="CHIEF EXAMINERS' REPORT" title="Past WAEC reports" description="General comments, strengths, and weaknesses observed in past candidates' performance." />
      <div className="chip-row" style={{ marginBottom: 18 }}>
        {subjects.map((s) => (
          <button key={s} className={'chip' + (subject === s ? ' chip-active' : '')} onClick={() => setSubject(s)}>{s}</button>
        ))}
      </div>
      <Stub moduleName="Report archive" blurb="Only two sample reports (Biology, Mathematics — 2023) are seeded. Real WAEC examiner reports for every subject/year would replace this array, ideally loaded from JSON like the question bank.">
        {filtered.map((r) => (
          <Card key={r.subject} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <span className="pill pill-default">{r.subject}</span>
              <span className="pill pill-gold mono">{r.year}</span>
            </div>
            <p style={{ fontSize: 13.5, marginBottom: 8 }}><strong>General:</strong> {r.general}</p>
            <p style={{ fontSize: 13.5, marginBottom: 8, color: 'var(--green)' }}><strong>Strengths:</strong> {r.strengths}</p>
            <p style={{ fontSize: 13.5, color: 'var(--red)' }}><strong>Weaknesses:</strong> {r.weaknesses}</p>
          </Card>
        ))}
      </Stub>
    </div>
  );
}
