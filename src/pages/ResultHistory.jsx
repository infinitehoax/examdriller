// src/pages/ResultHistory.jsx
import React, { useState } from 'react';
import { PageHeader, Card, EmptyState } from '../components/Shared';
import Icon from '../components/Icon';
import { storage } from '../lib/storage';

export default function ResultHistory() {
  const [results, setResults] = useState(storage.getResults());
  const [sortDesc, setSortDesc] = useState(true);

  function remove(id) {
    setResults(storage.deleteResult(id));
  }

  const sorted = [...results].sort((a, b) => sortDesc ? (b.scorePercent ?? 0) - (a.scorePercent ?? 0) : (a.scorePercent ?? 0) - (b.scorePercent ?? 0));

  return (
    <div>
      <PageHeader eyebrow="RESULT HISTORY" title="Past attempts" description="Every exam you've completed on this device." />

      {results.length === 0 ? (
        <EmptyState icon="history" title="No history yet" body="Completed exams will show up here." />
      ) : (
        <Card style={{ padding: 0 }}>
          <table className="history-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Mode</th>
                <th onClick={() => setSortDesc((v) => !v)} style={{ cursor: 'pointer' }}>Score {sortDesc ? '↓' : '↑'}</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={r.id}>
                  <td>{r.subject}</td>
                  <td><span className="pill pill-default">{r.testMode}</span></td>
                  <td className="mono">{r.scorePercent !== null ? `${r.scorePercent}%` : '—'}</td>
                  <td>{new Date(r.takenAt).toLocaleString()}</td>
                  <td><button onClick={() => remove(r.id)} title="Delete"><Icon name="trash" size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
