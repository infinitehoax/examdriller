// src/pages/StudyPlan.jsx
import React, { useState } from 'react';
import { PageHeader, Card, EmptyState } from '../components/Shared';
import Icon from '../components/Icon';
import { storage } from '../lib/storage';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function StudyPlan() {
  const [plan, setPlan] = useState(storage.getStudyPlan());
  const [subject, setSubject] = useState('');
  const [days, setDays] = useState([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  function toggleDay(d) {
    setDays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  }

  function addEntry() {
    if (!subject || days.length === 0 || !start || !end) return;
    const entry = { id: crypto.randomUUID(), subject, days, start, end, status: 'on-track' };
    const updated = { entries: [...plan.entries, entry] };
    storage.setStudyPlan(updated);
    setPlan(updated);
    setSubject(''); setDays([]); setStart(''); setEnd('');
  }

  function removeEntry(id) {
    const updated = { entries: plan.entries.filter((e) => e.id !== id) };
    storage.setStudyPlan(updated);
    setPlan(updated);
  }

  const today = new Date();
  const overdue = plan.entries.filter((e) => new Date(e.end) < today).length;
  const onTrack = plan.entries.length - overdue;

  return (
    <div>
      <PageHeader eyebrow="STUDY PLAN" title="Revision timetable" description="Build a simple schedule: subject, days of the week, and a date range." />

      <div className="results-summary" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
        <Card className="stat-card"><div className="stat-value">{plan.entries.length}</div><div className="stat-label">Entries</div></Card>
        <Card className="stat-card"><div className="stat-value" style={{ color: 'var(--green)' }}>{onTrack}</div><div className="stat-label">On track</div></Card>
        <Card className="stat-card"><div className="stat-value" style={{ color: 'var(--red)' }}>{overdue}</div><div className="stat-label">Overdue</div></Card>
      </div>

      <Card style={{ marginBottom: 20, maxWidth: 620 }}>
        <div className="field-label">New entry</div>
        <input placeholder="Subject (e.g. Biology)" value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: '100%', padding: 8, border: '1px solid var(--line)', borderRadius: 4, marginBottom: 10 }} />
        <div className="chip-row" style={{ marginBottom: 10 }}>
          {DAYS.map((d) => (
            <button key={d} className={'chip chip-small' + (days.includes(d) ? ' chip-active' : '')} onClick={() => toggleDay(d)}>{d}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} style={{ flex: 1, padding: 8, border: '1px solid var(--line)', borderRadius: 4 }} />
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} style={{ flex: 1, padding: 8, border: '1px solid var(--line)', borderRadius: 4 }} />
        </div>
        <button className="start-btn" onClick={addEntry}>Add to plan</button>
      </Card>

      {plan.entries.length === 0 ? (
        <EmptyState icon="calendar" title="No timetable yet" body="Add a subject above to start building your revision schedule." />
      ) : (
        plan.entries.map((e) => {
          const isOverdue = new Date(e.end) < today;
          return (
            <Card key={e.id} style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{e.subject}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{e.days.join(', ')} · {e.start} → {e.end}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={'pill ' + (isOverdue ? 'pill-red' : 'pill-default')}>{isOverdue ? 'Overdue' : 'On track'}</span>
                <button onClick={() => removeEntry(e.id)}><Icon name="trash" size={14} /></button>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}
