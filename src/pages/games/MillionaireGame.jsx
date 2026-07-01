// src/pages/games/MillionaireGame.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, PageHeader } from '../../components/Shared';
import { getQuestions } from '../../lib/questionBank';
import { storage } from '../../lib/storage';

const PRIZES = ['₦500', '₦1,000', '₦2,000', '₦5,000', '₦10,000', '₦20,000', '₦40,000', '₦80,000', '₦160,000', '₦320,000', '₦640,000', '₦1.28m', '₦2.56m', '₦5.12m', '₦1,000,000'];

export default function MillionaireGame() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [rung, setRung] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [usedFifty, setUsedFifty] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [gameOver, setGameOver] = useState(null);

  async function start() {
    const qs = await getQuestions({ mode: 'objective' });
    const shuffled = [...qs].sort(() => Math.random() - 0.5).slice(0, 15);
    setQuestions(shuffled);
    setRung(0);
    setPlaying(true);
    setUsedFifty(false);
    setHiddenOptions([]);
    setGameOver(null);
  }

  function answer(key) {
    const q = questions[rung];
    if (key === q.correctOption) {
      if (rung === questions.length - 1) {
        setGameOver({ won: true, prize: PRIZES[rung] });
        storage.recordLeaderboardScore({ category: 'millionaire-game', subject: 'all', value: rung + 1 });
        setPlaying(false);
      } else {
        setRung((r) => r + 1);
        setHiddenOptions([]);
      }
    } else {
      setGameOver({ won: false, prize: rung > 0 ? PRIZES[rung - 1] : '₦0' });
      storage.recordLeaderboardScore({ category: 'millionaire-game', subject: 'all', value: rung });
      setPlaying(false);
    }
  }

  function fiftyFifty() {
    if (usedFifty) return;
    const q = questions[rung];
    const wrong = q.options.filter((o) => o.key !== q.correctOption).map((o) => o.key);
    setHiddenOptions(wrong.sort(() => Math.random() - 0.5).slice(0, 2));
    setUsedFifty(true);
  }

  const q = questions[rung];

  return (
    <div>
      <PageHeader eyebrow="EDUCATIONAL GAMES" title="Millionaire Game" description="15-question ladder. One wrong answer ends the run." action={<button className="start-btn" onClick={() => navigate('/games')}>Back to games</button>} />

      {!playing && !gameOver && (
        <Card style={{ maxWidth: 420 }}>
          <button className="start-btn" onClick={start}>Start game</button>
        </Card>
      )}

      {gameOver && (
        <Card style={{ maxWidth: 420 }}>
          <h3>{gameOver.won ? 'You won!' : 'Game over'}</h3>
          <p className="mono" style={{ fontSize: 20 }}>{gameOver.prize}</p>
          <button className="start-btn" onClick={start}>Play again</button>
        </Card>
      )}

      {playing && q && (
        <div className="exam-grid">
          <Card className="question-card">
            <div className="pill pill-gold mono" style={{ marginBottom: 12 }}>Question {rung + 1} of 15 — {PRIZES[rung]}</div>
            <div className="q-text">{q.text}</div>
            {q.options.filter((o) => !hiddenOptions.includes(o.key)).map((opt) => (
              <div key={opt.key} className="option-row" onClick={() => answer(opt.key)}>
                <span className="option-key">{opt.key}</span>{opt.text}
              </div>
            ))}
            <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
              <button className="chip chip-small" disabled={usedFifty} onClick={fiftyFifty}>50:50</button>
              <span className="chip chip-small" style={{ opacity: 0.5 }}>Phone a friend</span>
              <span className="chip chip-small" style={{ opacity: 0.5 }}>Ask audience</span>
              <span className="chip chip-small" style={{ opacity: 0.5 }}>Switch</span>
            </div>
            <p style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 8 }}>
              Phone-a-friend, Ask-the-audience, and Switch lifelines are scaffolded in the prize ladder but not yet wired to a real hint source — only 50:50 is functional right now.
            </p>
          </Card>
          <Card>
            <div className="field-label">Prize ladder</div>
            {PRIZES.map((p, i) => (
              <div key={p} className="ladder-row" style={{
                fontWeight: i === rung ? 700 : 400,
                color: i === rung ? 'var(--green)' : i < rung ? 'var(--muted)' : 'var(--ink)',
                background: i === rung ? 'var(--gold-tint)' : 'transparent',
                padding: '4px 8px',
                borderRadius: 4,
                fontSize: 12.5,
              }}>
                {15 - i}. {PRIZES[14 - i]}
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}
