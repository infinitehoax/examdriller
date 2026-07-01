// src/pages/games/MathRush.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, PageHeader } from '../../components/Shared';
import { storage } from '../../lib/storage';
import './MathRush.css';

const OPS = ['+', '-', '*'];

function genProblem(difficulty) {
  const range = difficulty === 'hard' ? 20 : difficulty === 'medium' ? 12 : 9;
  const a = Math.floor(Math.random() * range) + 1;
  const b = Math.floor(Math.random() * range) + 1;
  const op = OPS[Math.floor(Math.random() * OPS.length)];
  let answer;
  if (op === '+') answer = a + b;
  else if (op === '-') answer = a - b;
  else answer = a * b;
  return { text: `${a} ${op} ${b}`, answer };
}

export default function MathRush() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('easy');
  const [speed, setSpeed] = useState(6);
  const [playing, setPlaying] = useState(false);
  const [problem, setProblem] = useState(null);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const intervalRef = useRef(null);

  const nextProblem = useCallback(() => {
    setProblem(genProblem(difficulty));
    setProgress(0);
    setInput('');
  }, [difficulty]);

  function start() {
    setScore(0);
    setLives(3);
    setPlaying(true);
    nextProblem();
  }

  function endGame() {
    setPlaying(false);
    clearInterval(intervalRef.current);
    storage.recordLeaderboardScore({ category: 'math-rush', subject: 'all', value: score });
  }

  useEffect(() => {
    if (!playing) return;
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p + 100 / (speed * 10);
        if (next >= 100) {
          setLives((l) => {
            const nl = l - 1;
            if (nl <= 0) setTimeout(endGame, 0);
            return nl;
          });
          setFeedback('miss');
          setTimeout(() => setFeedback(null), 400);
          nextProblem();
          return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, speed]);

  useEffect(() => {
    if (lives <= 0 && playing) endGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lives]);

  function submit(e) {
    e.preventDefault();
    if (!problem) return;
    if (Number(input) === problem.answer) {
      setScore((s) => s + Math.round(100 + (100 - progress)));
      setFeedback('hit');
      setTimeout(() => setFeedback(null), 300);
      nextProblem();
    } else {
      setInput('');
    }
  }

  return (
    <div>
      <PageHeader eyebrow="EDUCATIONAL GAMES" title="Math Rush" description="Solve the arithmetic before the block reaches the end of the belt." action={<button className="start-btn" onClick={() => navigate('/games')}>Back to games</button>} />

      {!playing ? (
        <Card style={{ maxWidth: 420 }}>
          <div className="field-label">Difficulty</div>
          <div className="chip-row" style={{ marginBottom: 16 }}>
            {['easy', 'medium', 'hard'].map((d) => (
              <button key={d} className={'chip' + (difficulty === d ? ' chip-active' : '')} onClick={() => setDifficulty(d)}>{d}</button>
            ))}
          </div>
          <div className="field-label">Speed (seconds per block)</div>
          <input type="range" min={3} max={10} value={speed} onChange={(e) => setSpeed(+e.target.value)} style={{ width: '100%' }} />
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>{speed}s</div>
          {score > 0 && <p className="mono" style={{ marginBottom: 12 }}>Last score: {score}</p>}
          <button className="start-btn" onClick={start}>Start</button>
        </Card>
      ) : (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span className="pill pill-gold mono">Score: {score}</span>
            <span className="pill pill-red mono">Lives: {'♥'.repeat(lives)}</span>
          </div>

          <div className="rush-belt">
            <div className="rush-block" style={{ left: `${progress}%` }}>
              {problem?.text}
            </div>
            <div className="rush-end" />
          </div>

          <form onSubmit={submit} style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <input
              autoFocus
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={'rush-input' + (feedback ? ' rush-' + feedback : '')}
              placeholder="Your answer"
            />
            <button className="start-btn" type="submit">Submit</button>
          </form>
        </Card>
      )}
    </div>
  );
}
