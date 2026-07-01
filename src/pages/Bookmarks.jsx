// src/pages/Bookmarks.jsx
import React, { useEffect, useState } from 'react';
import { PageHeader, Card, EmptyState } from '../components/Shared';
import Icon from '../components/Icon';
import { storage } from '../lib/storage';
import { getQuestionById } from '../lib/questionBank';

export default function Bookmarks() {
  const [ids, setIds] = useState(storage.getBookmarks());
  const [selected, setSelected] = useState(null);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    if (selected) getQuestionById(selected).then(setQuestion);
    else setQuestion(null);
  }, [selected]);

  function remove(id) {
    storage.toggleBookmark(id);
    setIds(storage.getBookmarks());
    if (selected === id) setSelected(null);
  }

  return (
    <div>
      <PageHeader eyebrow="BOOKMARKS" title="Saved questions" description="Questions you bookmarked during practice, kept here for quick review." />

      {ids.length === 0 ? (
        <EmptyState icon="bookmark" title="No bookmarks yet" body="Press the bookmark button during an exam to save a question here." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 18 }}>
          <Card>
            <div className="field-label">Question ID</div>
            <select value={selected || ''} onChange={(e) => setSelected(e.target.value)} style={{ width: '100%', padding: 8, border: '1px solid var(--line)', borderRadius: 4, marginBottom: 12 }}>
              <option value="">Select…</option>
              {ids.map((id) => <option key={id} value={id}>{id}</option>)}
            </select>
            {ids.map((id) => (
              <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 4px' }}>
                <span className="mono" style={{ fontSize: 12.5, cursor: 'pointer' }} onClick={() => setSelected(id)}>{id}</span>
                <button onClick={() => remove(id)} title="Remove"><Icon name="close" size={13} /></button>
              </div>
            ))}
          </Card>
          <Card>
            {question ? (
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <span className="pill pill-default">{question.subject}</span>
                  <span className="pill pill-gold">{question.topic}</span>
                </div>
                <div style={{ fontSize: 15, marginBottom: 14 }}>{question.text}</div>
                {question.options?.map((opt) => (
                  <div key={opt.key} className="answer-line" style={{ color: opt.key === question.correctOption ? 'var(--green)' : 'inherit', fontWeight: opt.key === question.correctOption ? 600 : 400 }}>
                    <span className="mono">{opt.key}.</span> {opt.text}
                  </div>
                ))}
                {question.explanation && <div className="explanation">{question.explanation}</div>}
              </div>
            ) : (
              <p style={{ color: 'var(--muted)', fontSize: 13 }}>Select a question ID to view it.</p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
