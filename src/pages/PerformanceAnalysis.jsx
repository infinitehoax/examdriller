// src/pages/PerformanceAnalysis.jsx
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PageHeader, Card, EmptyState } from '../components/Shared';
import { storage } from '../lib/storage';

const COLORS = ['#0B3D2E', '#3F7A52', '#E8B43A', '#D6483B', '#8C9A3A'];

export default function PerformanceAnalysis() {
  const results = storage.getResults().filter((r) => r.scorePercent !== null).reverse();

  const trend = results.map((r, i) => ({ name: `#${i + 1}`, score: r.scorePercent, speed: Math.round(r.timeSpentSec / Math.max(r.total, 1)) }));

  const bySubject = useMemo(() => {
    const map = {};
    results.forEach((r) => {
      map[r.subject] = map[r.subject] || { subject: r.subject, total: 0, count: 0 };
      map[r.subject].total += r.scorePercent;
      map[r.subject].count++;
    });
    return Object.values(map).map((s) => ({ subject: s.subject, avg: Math.round(s.total / s.count) }));
  }, [results]);

  const sortedSubjects = [...bySubject].sort((a, b) => b.avg - a.avg);
  const highest = sortedSubjects[0];
  const lowest = sortedSubjects[sortedSubjects.length - 1];

  if (results.length === 0) {
    return (
      <div>
        <PageHeader eyebrow="PERFORMANCE ANALYSIS" title="Your trends" description="Score, percent, and speed trends across attempts." />
        <EmptyState icon="chart" title="No data yet" body="Complete a few practice exams to see trends here." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader eyebrow="PERFORMANCE ANALYSIS" title="Your trends" description="Score, percent, and speed trends across attempts on this device." />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 18 }}>
        <Card>
          <div className="field-label">Score trend</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trend}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#0B3D2E" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div className="field-label">Aggregate by subject</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={bySubject} dataKey="avg" nameKey="subject" innerRadius={45} outerRadius={75} label={(e) => `${e.subject}`}>
                {bySubject.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        <Card>
          <div className="field-label" style={{ color: 'var(--green)' }}>Highest performing</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{highest?.subject}</div>
          <div className="mono" style={{ color: 'var(--green)' }}>{highest?.avg}% avg</div>
        </Card>
        <Card>
          <div className="field-label" style={{ color: '#8a6716' }}>Moderate</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{sortedSubjects[Math.floor(sortedSubjects.length / 2)]?.subject}</div>
          <div className="mono">{sortedSubjects[Math.floor(sortedSubjects.length / 2)]?.avg}% avg</div>
        </Card>
        <Card>
          <div className="field-label" style={{ color: 'var(--red)' }}>Lowest performing</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{lowest?.subject}</div>
          <div className="mono" style={{ color: 'var(--red)' }}>{lowest?.avg}% avg</div>
        </Card>
      </div>
    </div>
  );
}
