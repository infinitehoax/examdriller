// src/pages/PracticeExam.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { Card } from '../components/Shared';
import { getQuestions } from '../lib/questionBank';
import { storage } from '../lib/storage';
import './Practice.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PracticeExam() {
  const navigate = useNavigate();
  const [config] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('testdriller:examConfig')); } catch { return null; }
  });
  const [questions, setQuestions] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [showCalc, setShowCalc] = useState(false);
  const [startedAt] = useState(Date.now());

  useEffect(() => {
    if (!config) { navigate('/practice'); return; }
    (async () => {
      let qs = await getQuestions({ subjectCodes: config.subjects, topics: config.topics, mode: config.mode });
      if (config.shuffleQ) qs = shuffle(qs);
      qs = qs.slice(0, config.numQuestions);
      if (config.shuffleO) {
        qs = qs.map((q) => (q.options ? { ...q, options: shuffle(q.options) } : q));
      }
      setQuestions(qs);
      setSecondsLeft(config.duration * 60);
    })();
  }, [config, navigate]);

  const submitExam = useCallback(() => {
    if (!questions) return;
    let correct = 0;
    const objective = questions.filter((q) => q.mode === 'objective');
    objective.forEach((q) => { if (answers[q.id] === q.correctOption) correct++; });
    const scorePercent = objective.length ? Math.round((correct / objective.length) * 100) : null;
    const timeSpentSec = Math.round((Date.now() - startedAt) / 1000);

    const result = {
      subject: questions[0]?.subject || 'Mixed',
      mode: config.mode,
      testMode: config.testMode,
      scorePercent,
      correct,
      total: objective.length,
      timeSpentSec,
      questions,
      answers,
    };
    storage.addResult(result);
    storage.recordLeaderboardScore({ category: 'exam-practice', subject: result.subject, value: scorePercent ?? 0 });
    sessionStorage.setItem('testdriller:lastResult', JSON.stringify(result));
    navigate('/practice/result');
  }, [questions, answers, config, startedAt, navigate]);

  useEffect(() => {
    if (secondsLeft === null) return;
    if (secondsLeft <= 0) { submitExam(); return; }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, submitExam]);

  const q = questions?.[current];

  const selectOption = useCallback((key) => {
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.id]: key }));
  }, [q]);

  useEffect(() => {
    function onKey(e) {
      if (!questions) return;
      const k = e.key.toUpperCase();
      if (k === 'N') setCurrent((c) => Math.min(c + 1, questions.length - 1));
      else if (k === 'P') setCurrent((c) => Math.max(c - 1, 0));
      else if (['A', 'B', 'C', 'D'].includes(k) && q?.options) selectOption(k);
      else if (k === 'S') submitExam();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [questions, q, selectOption, submitExam]);

  const toggleBookmark = () => q && storage.toggleBookmark(q.id);

  const mm = secondsLeft !== null ? String(Math.floor(secondsLeft / 60)).padStart(2, '0') : '--';
  const ss = secondsLeft !== null ? String(secondsLeft % 60).padStart(2, '0') : '--';

  if (!questions) return <Card>Loading questions…</Card>;
  if (questions.length === 0) {
    return (
      <Card>
        No questions matched your filters yet — the sample bank is small. Try removing topic filters or picking another subject.
        <div style={{ marginTop: 14 }}>
          <button className="start-btn" onClick={() => navigate('/practice')}>Back to setup</button>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="exam-utilitybar">
        <div className="util-actions">
          <button onClick={() => navigate('/practice')}><Icon name="close" size={14} /> Exit</button>
          <button onClick={() => setShowCalc((v) => !v)}><Icon name="calc" size={14} /> Calculator</button>
          <button onClick={toggleBookmark}><Icon name="bookmark" size={14} /> Bookmark</button>
          <button onClick={() => navigate('/feedback')}><Icon name="report" size={14} /> Report error</button>
          <button onClick={() => navigate('/dictionary')}><Icon name="dictionary" size={14} /> Dictionary</button>
        </div>
        <div className="util-actions">
          <span className="timer mono"><Icon name="clock" size={14} /> {mm}:{ss}</span>
          <button className="submit-btn" style={{ background: 'var(--gold)', color: 'var(--green)', borderRadius: 4, padding: '4px 12px' }} onClick={submitExam}>Submit</button>
        </div>
      </div>

      {showCalc && (
        <Card style={{ marginBottom: 16, maxWidth: 220 }}>
          <CalculatorWidget />
        </Card>
      )}

      {q.mode === 'theory' ? (
        <TheoryRunner questions={questions} current={current} setCurrent={setCurrent} answers={answers} setAnswers={setAnswers} />
      ) : (
        <div className="exam-grid">
          <Card className="question-card">
            <div className="q-meta">
              <span className="pill pill-default">{q.subject}</span>
              <span className="pill pill-gold">{q.topic}</span>
            </div>
            <div className="q-text">{current + 1}. {q.text}</div>
            <div>
              {q.options.map((opt) => (
                <div
                  key={opt.key}
                  className={'option-row' + (answers[q.id] === opt.key ? ' selected' : '')}
                  onClick={() => selectOption(opt.key)}
                >
                  <span className="option-key">{opt.key}</span>
                  <span>{opt.text}</span>
                </div>
              ))}
            </div>
            <div className="exam-nav-footer">
              <button onClick={() => setCurrent((c) => Math.max(c - 1, 0))} disabled={current === 0}>← Previous</button>
              {current < questions.length - 1 ? (
                <button onClick={() => setCurrent((c) => Math.min(c + 1, questions.length - 1))}>Next →</button>
              ) : (
                <button className="submit-btn" onClick={submitExam}>Submit exam</button>
              )}
            </div>
          </Card>

          <Card>
            <div className="field-label">Questions</div>
            <div className="question-nav-grid">
              {questions.map((qq, i) => (
                <button
                  key={qq.id}
                  className={'q-nav-cell' + (answers[qq.id] !== undefined ? ' attempted' : '') + (i === current ? ' current' : '')}
                  onClick={() => setCurrent(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function TheoryRunner({ questions, current, setCurrent, answers, setAnswers }) {
  const q = questions[current];
  return (
    <div className="theory-layout">
      <Card className="theory-tree">
        <div className="field-label">Questions</div>
        {questions.map((qq, i) => (
          <div key={qq.id}>
            <div className={'theory-tree-item' + (i === current ? ' active' : '')} onClick={() => setCurrent(i)}>
              {i + 1}. {qq.topic}
            </div>
            {i === current && qq.subparts?.map((sp) => (
              <div key={sp.id} className="theory-subpart">{sp.id}) {sp.marks} marks</div>
            ))}
          </div>
        ))}
      </Card>
      <Card>
        <div className="q-meta">
          <span className="pill pill-default">{q.subject}</span>
          <span className="pill pill-gold">{q.topic}</span>
        </div>
        <div className="q-text">{q.text}</div>
        {q.subparts?.map((sp) => (
          <div key={sp.id} style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 6 }}>
              {sp.id}) {sp.text} <span className="pill pill-default">{sp.marks} marks</span>
            </div>
            <textarea
              className="theory-answer"
              placeholder="Type your answer…"
              value={answers[q.id]?.[sp.id] || ''}
              onChange={(e) => setAnswers((prev) => ({
                ...prev,
                [q.id]: { ...(prev[q.id] || {}), [sp.id]: e.target.value },
              }))}
            />
          </div>
        ))}
      </Card>
    </div>
  );
}

function CalculatorWidget() {
  const [expr, setExpr] = useState('');

  // Safe arithmetic evaluator (no eval): tokenize, shunting-yard, evaluate.
  function safeEvaluate(input) {
    const cleaned = input.replace(/[^0-9+\-*/.() ]/g, '');
    const tokens = cleaned.match(/(\d+\.?\d*)|[+\-*/()]/g);
    if (!tokens) throw new Error('empty');
    const prec = { '+': 1, '-': 1, '*': 2, '/': 2 };
    const output = [];
    const ops = [];
    tokens.forEach((tok) => {
      if (/^\d/.test(tok)) output.push(parseFloat(tok));
      else if (tok === '(') ops.push(tok);
      else if (tok === ')') {
        while (ops.length && ops[ops.length - 1] !== '(') applyOp(output, ops.pop());
        ops.pop();
      } else {
        while (ops.length && prec[ops[ops.length - 1]] >= prec[tok]) applyOp(output, ops.pop());
        ops.push(tok);
      }
    });
    while (ops.length) applyOp(output, ops.pop());
    if (output.length !== 1 || Number.isNaN(output[0])) throw new Error('invalid');
    return output[0];
  }

  function applyOp(stack, op) {
    const b = stack.pop();
    const a = stack.pop();
    if (op === '+') stack.push(a + b);
    else if (op === '-') stack.push(a - b);
    else if (op === '*') stack.push(a * b);
    else if (op === '/') stack.push(a / b);
  }

  function evaluate() {
    try {
      setExpr(String(safeEvaluate(expr)));
    } catch {
      setExpr('Error');
    }
  }
  return (
    <div>
      <div className="field-label">Calculator</div>
      <input
        style={{ width: '100%', padding: 8, fontFamily: 'var(--font-mono)', border: '1px solid var(--line)', borderRadius: 4, marginBottom: 8 }}
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && evaluate()}
        placeholder="e.g. 12*3.5"
      />
      <button className="start-btn" style={{ padding: '6px 14px', fontSize: 12 }} onClick={evaluate}>=</button>
    </div>
  );
}
