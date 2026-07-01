// src/pages/Games.jsx
import React from 'react';
import { PageHeader, Tile } from '../components/Shared';

const GAMES = [
  { key: 'fame', label: 'Fame Game (60s)', icon: 'clock', path: '/games/fame', blurb: 'Answer as many MCQs as possible in 60 seconds' },
  { key: 'millionaire', label: 'Millionaire Game', icon: 'trophy', path: '/games/millionaire', blurb: '15-question ladder, lifelines included' },
  { key: 'mathrush', label: 'Math Rush', icon: 'target', path: '/games/math-rush', blurb: 'Solve arithmetic before the block lands — playable now' },
  { key: 'map', label: 'Map Game', icon: 'flag', path: '/games/map', blurb: 'Identify countries, capitals, and flags on interactive maps' },
];

export default function Games() {
  return (
    <div>
      <PageHeader eyebrow="EDUCATIONAL GAMES" title="Games" description="Gamified learning, four ways." />
      <div className="tile-grid">
        {GAMES.map((g) => <Tile key={g.key} {...g} />)}
      </div>
    </div>
  );
}
