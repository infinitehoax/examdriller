// src/pages/PracticeResult.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Card, PageHeader, GradeBadge } from '../components/Shared';
import './Practice.css';

function scoreToGrade(pct) {
  if (pct >= 75) return 'A1';
  if (pct >= 70) return 'B2';
  if (pct >= 65) return 'B3';
  if (pct >= 60) return 'C4';
  if (pct >= 55) return 'C5';
  if (pct >= 50) return 'C6';
  if (pct >= 45) return 'D7';
  if (pct >= 40) return 'E8';
  return 'F9';
}

const COLORS = ['#0B3D2E', '#D6483B'];

export default function PracticeResult() {
  const navigate = useNavigate();
  const [showCorrections, setShowCorrections] = useState(false);
  const result = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem('testdriller:lastResult')); } catch { return null; }
  }, []);

  const topicBreakdown = useMemo(() => {
    if (!result) return [];
    const map = {};
    result.questions.forEach((q) => {
      if (q.mode !== 'objective') return;
      map[q.topic] = map[q.topic] || { topic: q.topic, correct: 0, total: 0 };
      map[q.topic].total++;
      if (result.answers[q.id] === q.correctOption) map[q.topic].correct++;
    });
    return Object.values(map);
  }, [result]);

  if (!result) {
    return (
      <Card>
        No recent result found.
        <div style={{ marginTop: 12 }}>
          <button className="start-btn" onClick={() => navigate('/practice')}>Start a practice exam</button>
        </div>
      </Card>
    );
  }

  const { questions, answers, correct, total, scorePercent, timeSpentSec } = result;
  const wrong = total - correct;
  const grade = scoreToGrade(scorePercent ?? 0);

  return (
    <div>
      <PageHeader
        eyebrow="EXAM SIMULATOR · RESULT"
        title={`${result.subject} — ${result.testMode} exam`}
        description={`Completed in ${Math.floor(timeSpentSec / 60)}m ${timeSpentSec % 60}s.`}
        action={<button className="start-btn" onClick={() => navigate('/practice')}>New exam</button>}
      />

      <div className="results-summary">
        <Card className="stat-card">
          <div className="stat-value">{scorePercent}%</div>
          <div className="stat-label">Score</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-value"><GradeBadge grade={grade} /></div>
          <div className="stat-label">WASSCE grade</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-value">{correct}/{total}</div>
          <div className="stat-label">Correct</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-value">{Math.round(timeSpentSec / Math.max(total, 1))}s</div>
          <div className="stat-label">Avg. speed / question</div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card>
          <div className="field-label">Correct vs incorrect</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={[{ name: 'Correct', value: correct }, { name: 'Incorrect', value: wrong }]} dataKey="value" innerRadius={50} outerRadius={80}>
                {[0, 1].map((i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div className="field-label">By topic</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topicBreakdown}>
              <XAxis dataKey="topic" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="correct" fill="#0B3D2E" radius={[3,3,0,0]} />
              <Bar dataKey="total" fill="#D8D0BD" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <button className="start-btn" onClick={() => setShowCorrections((v) => !v)}>
        {showCorrections ? 'Hide corrections' : 'View corrections'}
      </button>

      {showCorrections && (
        <div style={{ marginTop: 18 }}>
          {questions.filter((q) => q.mode === 'objective').map((q, i) => {
            const userAns = answers[q.id];
            const isCorrect = userAns === q.correctOption;
            return (
              <div className="correction-row" key={q.id}>
                <div className="correction-q">{i + 1}. {q.text}</div>
                {q.options.map((opt) => {
                  const isUser = opt.key === userAns;
                  const isRight = opt.key === q.correctOption;
                  return (
                    <div
                      key={opt.key}
                      className="answer-line"
                      style={{ color: isRight ? 'var(--green)' : isUser ? 'var(--red)' : 'inherit', fontWeight: isRight ? 600 : 400 }}
                    >
                      <span className="mono">{opt.key}.</span> {opt.text}
                      {isRight && ' ✓'}
                      {isUser && !isRight && ' ✗ (your answer)'}
                    </div>
                  );
                })}
                {!isCorrect && q.explanation && <div className="explanation">{q.explanation}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
