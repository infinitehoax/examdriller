// src/pages/Classroom.jsx
import React, { useEffect, useState } from 'react';
import { PageHeader, Card, Stub } from '../components/Shared';
import Icon from '../components/Icon';
import { loadManifest, loadSubject } from '../lib/questionBank';
import { storage } from '../lib/storage';
import './Classroom.css';

export default function Classroom() {
  const [subjects, setSubjects] = useState([]);
  const [activeSubject, setActiveSubject] = useState(null);
  const [bank, setBank] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const subs = await loadManifest();
      setSubjects(subs);
      if (subs[0]) selectSubject(subs[0].code);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function selectSubject(code) {
    setActiveSubject(code);
    const b = await loadSubject(code);
    setBank(b);
    setActiveTopic(b.topics[0]);
  }

  function listen(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  }

  const topicQuestions = bank?.questions.filter((q) => q.topic === activeTopic) || [];
  const progress = storage.getClassroomProgress()[activeSubject] || { completion: 0, timeSpent: 0, bestScore: null };

  return (
    <div>
      <PageHeader
        eyebrow="CLASSROOM"
        title="Study Material"
        description="Browse the syllabus by topic, read worked notes drawn from the question bank, and listen along."
        action={<button className="start-btn" onClick={() => setProgressOpen((v) => !v)}>View progress</button>}
      />

      {progressOpen && bank && (
        <Card style={{ marginBottom: 18 }}>
          <div className="field-label">{bank.subject} — progress</div>
          <div className="progress-stats">
            <div><div className="stat-value">{progress.completion || 0}%</div><div className="stat-label">Completion</div></div>
            <div><div className="stat-value">{progress.completedTests || 0}</div><div className="stat-label">Tests completed</div></div>
            <div><div className="stat-value">{progress.bestScore ?? '—'}</div><div className="stat-label">Best score</div></div>
            <div><div className="stat-value">{Math.round((progress.timeSpent || 0) / 60)}m</div><div className="stat-label">Time spent</div></div>
          </div>
        </Card>
      )}

      <div className="classroom-layout">
        <Card className="classroom-sidebar">
          <div className="field-label">Subject</div>
          <select value={activeSubject || ''} onChange={(e) => selectSubject(e.target.value)} style={{ width: '100%', marginBottom: 14, padding: 8, border: '1px solid var(--line)', borderRadius: 4 }}>
            {subjects.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
          </select>
          <div className="field-label">Topics</div>
          {bank?.topics.map((t) => (
            <div key={t} className={'topic-item' + (t === activeTopic ? ' active' : '')} onClick={() => setActiveTopic(t)}>
              {t}
            </div>
          ))}
        </Card>

        <Card className="classroom-content">
          {bank ? (
            <>
              <div className="content-header">
                <h2 style={{ fontSize: 19 }}>{activeTopic}</h2>
                <button className="listen-btn" onClick={() => listen(`${activeTopic}. ${topicQuestions.map((q) => q.text).join('. ')}`)}>
                  <Icon name="speaker" size={15} /> {speaking ? 'Listening…' : 'Listen'}
                </button>
              </div>

              <Stub moduleName="Rich content rendering" blurb="Real lesson prose, LaTeX/MathJax equations, and chemical formula rendering aren't wired up yet — this view summarises from the question bank as a stand-in.">
                {topicQuestions.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: 13 }}>No sample content for this topic yet.</p>
                ) : (
                  topicQuestions.map((q) => (
                    <div key={q.id} className="note-block">
                      <div style={{ fontWeight: 600, marginBottom: 6 }}>{q.text}</div>
                      <div style={{ fontSize: 13, color: 'var(--muted)' }}>{q.explanation || q.markScheme}</div>
                    </div>
                  ))
                )}
              </Stub>
            </>
          ) : <p>Loading…</p>}
        </Card>
      </div>
    </div>
  );
}
