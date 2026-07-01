// src/pages/Leaderboard.jsx
import React, { useState } from 'react';
import { PageHeader, Card, Pill } from '../components/Shared';
import { getLocalLeaderboard, LEADERBOARD_CATEGORIES } from '../lib/leaderboard';
import './Leaderboard.css';

export default function Leaderboard() {
  const [category, setCategory] = useState('exam-practice');
  const rows = getLocalLeaderboard({ category });

  return (
    <div>
      <PageHeader
        eyebrow="LEADERBOARD"
        title="Rankings"
        description="Right now this ranks only this device's local scores against a few seeded names, since there's no backend yet. See the note below for how this plugs into Trophy.so for a real cross-device leaderboard."
      />

      <div className="chip-row" style={{ marginBottom: 18 }}>
        {LEADERBOARD_CATEGORIES.map((c) => (
          <button key={c.key} className={'chip' + (category === c.key ? ' chip-active' : '')} onClick={() => setCategory(c.key)}>
            {c.label}
          </button>
        ))}
      </div>

      <Card style={{ padding: 0, marginBottom: 16 }}>
        {rows.map((row) => (
          <div key={row.userId} className={'lb-row' + (row.isCurrentUser ? ' lb-row-me' : '')}>
            <span className={'lb-rank' + (row.rank <= 3 ? ' lb-rank-top' : '')}>{row.rank}</span>
            <span className="lb-avatar">{row.userName?.[0]?.toUpperCase() || '?'}</span>
            <div className="lb-info">
              <div className="lb-name">{row.userName}{row.isCurrentUser && <Pill tone="gold"> you</Pill>}</div>
              <div className="lb-byline">{row.byline}</div>
            </div>
            <div className="lb-value mono">{row.value}</div>
          </div>
        ))}
      </Card>

      <Card className="trophy-note">
        <strong>About this leaderboard:</strong> scores are computed entirely in the browser from <code>localStorage</code> plus a few seeded names, so this only ever reflects the current device. A real global leaderboard needs a backend — <a href="https://trophy.so" target="_blank" rel="noreferrer">Trophy</a> is a hosted gamification API built for exactly this (leaderboards, streaks, points), with an open-source React UI kit. These rows are already shaped to match Trophy's <code>LeaderboardRankings</code> component props (<code>userId, userName, rank, value, byline</code>), so wiring in real Trophy data later is a data-source swap, not a UI rewrite — see <code>src/lib/leaderboard.js</code> for the exact steps.
      </Card>
    </div>
  );
}
