// src/pages/games/MapGame.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, PageHeader, Stub } from '../../components/Shared';

const GEOGRAPHIES = ['Africa', 'Asia', 'Australia', 'Europe', 'Nigeria', 'North America', 'South America'];
const TASKS = ['Countries', 'Capitals', 'Flags', 'Facts'];

const NIGERIA_STATES = [
  { name: 'Lagos', x: 80, y: 210 },
  { name: 'Rivers', x: 160, y: 230 },
  { name: 'Kano', x: 190, y: 60 },
  { name: 'Oyo', x: 110, y: 170 },
  { name: 'Borno', x: 320, y: 70 },
];

export default function MapGame() {
  const navigate = useNavigate();
  const [geography, setGeography] = useState('Nigeria');
  const [task, setTask] = useState('Countries');
  const [target, setTarget] = useState(NIGERIA_STATES[Math.floor(Math.random() * NIGERIA_STATES.length)]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);

  function clickState(state) {
    if (state.name === target.name) {
      setScore((s) => s + 10);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
    setTimeout(() => {
      setFeedback(null);
      setTarget(NIGERIA_STATES[Math.floor(Math.random() * NIGERIA_STATES.length)]);
    }, 600);
  }

  return (
    <div>
      <PageHeader eyebrow="EDUCATIONAL GAMES" title="Map Game" description="Click the region the prompt asks for." action={<button className="start-btn" onClick={() => navigate('/games')}>Back to games</button>} />

      <div className="chip-row" style={{ marginBottom: 12 }}>
        {GEOGRAPHIES.map((g) => (
          <button key={g} className={'chip chip-small' + (geography === g ? ' chip-active' : '')} onClick={() => setGeography(g)}>{g}</button>
        ))}
      </div>
      <div className="chip-row" style={{ marginBottom: 18 }}>
        {TASKS.map((t) => (
          <button key={t} className={'chip chip-small' + (task === t ? ' chip-active' : '')} onClick={() => setTask(t)}>{t}</button>
        ))}
      </div>

      {geography === 'Nigeria' ? (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span className="pill pill-gold mono">Score: {score}</span>
            <span className="pill pill-default">Find: <strong>{target.name}</strong></span>
          </div>
          <svg viewBox="0 0 400 280" style={{ width: '100%', maxWidth: 420, background: 'var(--paper)', borderRadius: 6 }}>
            {NIGERIA_STATES.map((s) => (
              <g key={s.name} onClick={() => clickState(s)} style={{ cursor: 'pointer' }}>
                <circle cx={s.x} cy={s.y} r={18} fill={feedback && s.name === target.name ? (feedback === 'correct' ? 'var(--green)' : 'var(--red)') : 'var(--gold)'} stroke="var(--green)" strokeWidth={1.5} />
                <text x={s.x} y={s.y + 32} fontSize={11} textAnchor="middle" fontFamily="var(--font-mono)" fill="var(--ink)">{s.name}</text>
              </g>
            ))}
          </svg>
          <p style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 10 }}>
            Demo geometry only — five Nigerian states as a proof of the click-to-identify mechanic. Real SVG topology for all seven geographies (with accurate borders) is the next step.
          </p>
        </Card>
      ) : (
        <Stub moduleName={`${geography} map`} blurb="This geography's SVG topology hasn't been built yet — only Nigeria has a working demo map. Plug in real SVG country/state paths here (e.g. from a TopoJSON source) to extend the game." />
      )}
    </div>
  );
}
