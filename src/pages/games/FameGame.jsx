// src/pages/games/FameGame.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, PageHeader } from '../../components/Shared';
import { getQuestions } from '../../lib/questionBank';
import { storage } from '../../lib/storage';

export default function FameGame() {
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(false);
  const [pool, setPool] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(60);
  const timerRef = useRef(null);

  async function start() {
    const qs = await getQuestions({ mode: 'objective' });
    setPool([...qs].sort(() => Math.random() - 0.5));
    setIdx(0);
    setScore(0);
    setSeconds(60);
    setPlaying(true);
  }

  useEffect(() => {
    if (!playing) return;
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          setPlaying(false);
          storage.recordLeaderboardScore({ category: 'fame-game', subject: 'all', value: score });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  function answer(key) {
    const q = pool[idx % pool.length];
    if (key === q.correctOption) setScore((s) => s + 10);
    setIdx((i) => i + 1);
  }

  const q = pool[idx % pool.length];

  return (
    <div>
      <PageHeader eyebrow="EDUCATIONAL GAMES" title="Fame Game" description="60 seconds, as many correct answers as possible." action={<button className="start-btn" onClick={() => navigate('/games')}>Back to games</button>} />

      {!playing ? (
        <Card style={{ maxWidth: 420 }}>
          {score > 0 && <p className="mono" style={{ marginBottom: 12 }}>Last score: {score}</p>}
          <button className="start-btn" onClick={start}>Start 60s round</button>
        </Card>
      ) : (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span className="pill pill-gold mono">Score: {score}</span>
            <span className="pill pill-red mono">{seconds}s left</span>
          </div>
          {q ? (
            <div>
              <div className="q-text" style={{ fontSize: 15 }}>{q.text}</div>
              {q.options.map((opt) => (
                <div key={opt.key} className="option-row" onClick={() => answer(opt.key)}>
                  <span className="option-key">{opt.key}</span>{opt.text}
                </div>
              ))}
            </div>
          ) : <p>Loading questions…</p>}
        </Card>
      )}
    </div>
  );
}
