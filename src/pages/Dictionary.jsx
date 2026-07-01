// src/pages/Dictionary.jsx
import React, { useState } from 'react';
import { PageHeader, Card } from '../components/Shared';
import Icon from '../components/Icon';

// Small seed dictionary so the module works end-to-end; swap for a real API later.
const SEED = {
  platitude: { partOfSpeech: 'noun', definition: 'A remark that is trite, overused, or used as though it were original or significant.' },
  mitochondrion: { partOfSpeech: 'noun', definition: 'An organelle found in large numbers in most cells, responsible for generating ATP through aerobic respiration.' },
  transpiration: { partOfSpeech: 'noun', definition: 'The process by which water vapour is lost from plants, mainly through the stomata of leaves.' },
  ratify: { partOfSpeech: 'verb', definition: 'To confirm or make official, typically by a vote or signature.' },
  pollination: { partOfSpeech: 'noun', definition: 'The transfer of pollen grains from the anther to the stigma of a flower.' },
};

export default function Dictionary() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);

  function search(term) {
    const key = term.trim().toLowerCase();
    if (SEED[key]) { setResult({ word: key, ...SEED[key] }); setNotFound(false); }
    else { setResult(null); setNotFound(!!key); }
  }

  function speak(word) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.speak(new window.SpeechSynthesisUtterance(word));
  }

  return (
    <div>
      <PageHeader eyebrow="DICTIONARY" title="Dictionary" description="Definitions and pronunciation for words you meet in your study material." />

      <Card style={{ maxWidth: 540 }}>
        <input
          autoFocus
          placeholder="Type a word… (try 'platitude' or 'mitochondrion')"
          value={query}
          onChange={(e) => { setQuery(e.target.value); search(e.target.value); }}
          style={{ width: '100%', padding: '12px 14px', fontSize: 15, border: '1px solid var(--line)', borderRadius: 4 }}
        />

        {result && (
          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h3 style={{ fontSize: 20 }}>{result.word}</h3>
              <button onClick={() => speak(result.word)} title="Pronounce" style={{ background: 'var(--green-tint)', border: 'none', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)' }}>
                <Icon name="speaker" size={14} />
              </button>
              <span className="pill pill-default">{result.partOfSpeech}</span>
            </div>
            <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.5 }}>{result.definition}</p>
          </div>
        )}

        {notFound && (
          <p style={{ marginTop: 14, fontSize: 13, color: 'var(--muted)' }}>
            Not in the seed dictionary yet — only a handful of words are wired up in this scaffold ({Object.keys(SEED).join(', ')}).
          </p>
        )}
      </Card>
    </div>
  );
}
