// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Tile, Card } from '../components/Shared';
import Icon from '../components/Icon';
import { getAllTiles } from '../lib/modules';
import { storage } from '../lib/storage';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const PROMOS = [
  { title: 'WASSCE Challenge: Round 4', body: 'Biology & Chemistry — Saturday, 10:00 AM', tone: 'gold' },
  { title: 'New: Chief Examiners\' Report 2024', body: 'See where last year\'s candidates lost marks', tone: 'green' },
  { title: 'Math Rush high score', body: 'Beat 18,400 points to top this week\'s board', tone: 'red' },
];

export default function Dashboard() {
  const [promoIdx, setPromoIdx] = useState(0);
  const navigate = useNavigate();
  const results = storage.getResults();
  const tiles = getAllTiles();

  useEffect(() => {
    const t = setInterval(() => setPromoIdx((i) => (i + 1) % PROMOS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const profile = storage.getProfile();
  const lastResult = results[0];

  return (
    <div>
      <div className="dash-grid">
        <div>
          <div className="dash-greeting">
            <div className="page-eyebrow mono">DASHBOARD</div>
            <h1 className="page-title">
              {profile.name ? `Welcome back, ${profile.name.split(' ')[0]}` : 'Welcome to TestDriller'}
            </h1>
            <p className="page-desc">
              {profile.subjects?.length
                ? `Tracking ${profile.subjects.length} subjects.`
                : 'Set up your profile and subject combination to personalise your dashboard.'}
              {!profile.name && (
                <button className="link-btn" onClick={() => navigate('/profile')}> Complete your profile →</button>
              )}
            </p>
          </div>

          <div className="tile-grid">
            {tiles.map((t) => (
              <Tile key={t.key} icon={t.icon} label={t.label} blurb={t.blurb} path={t.path} />
            ))}
          </div>
        </div>

        <div className="dash-rail">
          <Card className="promo-card" style={{ borderLeft: `4px solid var(--${PROMOS[promoIdx].tone === 'gold' ? 'gold' : PROMOS[promoIdx].tone === 'red' ? 'red' : 'green'})` }}>
            <div className="promo-dots">
              {PROMOS.map((_, i) => (
                <span key={i} className={'dot' + (i === promoIdx ? ' active' : '')} />
              ))}
            </div>
            <h3 style={{ fontSize: 15 }}>{PROMOS[promoIdx].title}</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '6px 0 0' }}>{PROMOS[promoIdx].body}</p>
          </Card>

          <Card style={{ marginTop: 14 }}>
            <div className="rail-title">Last attempt</div>
            {lastResult ? (
              <div className="last-result">
                <div className="last-result-score mono">{lastResult.scorePercent}%</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{lastResult.subject}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(lastResult.takenAt).toLocaleDateString()}</div>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>No exams taken yet — start with Practice for WASSCE.</p>
            )}
          </Card>

          <Card style={{ marginTop: 14 }}>
            <div className="rail-title">Keyboard shortcuts</div>
            <ul className="shortcut-list">
              <li><kbd>N</kbd> Next question</li>
              <li><kbd>P</kbd> Previous question</li>
              <li><kbd>A–D</kbd> Select option</li>
              <li><kbd>S</kbd> Submit</li>
            </ul>
          </Card>
        </div>
      </div>

      <button className="chat-fab" onClick={() => navigate('/ai-tutor')} title="Ask Clara, the AI Tutor">
        <Icon name="send" size={18} />
        <span>Ask Clara</span>
      </button>
    </div>
  );
}
