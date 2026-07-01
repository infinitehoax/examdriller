// src/pages/Literature.jsx
import React, { useState } from 'react';
import { PageHeader, Card, Stub } from '../components/Shared';

const BOOKS = [
  {
    title: 'Things Fall Apart',
    author: 'Chinua Achebe',
    sections: {
      Background: 'Set in pre-colonial Igbo society in the late 1800s, exploring the arrival of British colonialism and Christian missionaries.',
      Plot: 'Follows Okonkwo, a respected Igbo leader, through his rise and tragic fall as colonial forces disrupt traditional society.',
      Themes: 'Tradition vs. change, masculinity, fate vs. free will, colonialism.',
      Characters: 'Okonkwo, Nwoye, Ekwefi, Ezinma, Mr. Brown, Reverend Smith.',
      'About the Author': 'Chinua Achebe (1930–2013) was a Nigerian novelist, poet, and critic, widely regarded as a foundational figure of African literature in English.',
    },
  },
];

export default function Literature() {
  const [active, setActive] = useState(BOOKS[0]);
  const [section, setSection] = useState('Background');

  return (
    <div>
      <PageHeader eyebrow="WASSCE LITERATURE BOOKS" title="Prescribed texts" description="Summaries and notes on set texts." />
      <div className="classroom-layout">
        <Card className="classroom-sidebar">
          <div className="field-label">Book</div>
          {BOOKS.map((b) => (
            <div key={b.title} className={'topic-item' + (active.title === b.title ? ' active' : '')} onClick={() => { setActive(b); setSection(Object.keys(b.sections)[0]); }}>
              {b.title}
            </div>
          ))}
          <div className="field-label" style={{ marginTop: 14 }}>Section</div>
          {Object.keys(active.sections).map((s) => (
            <div key={s} className={'topic-item' + (section === s ? ' active' : '')} onClick={() => setSection(s)}>{s}</div>
          ))}
        </Card>
        <Card className="classroom-content">
          <h2 style={{ fontSize: 19, marginBottom: 4 }}>{active.title}</h2>
          <p style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 16 }}>{active.author}</p>
          <Stub moduleName="Full library" blurb="Only one prescribed text has sample notes wired in. Drop more books into this file's BOOKS array (or move it to a JSON file alongside the question bank) to extend the library.">
            <h3 style={{ fontSize: 15, marginBottom: 8 }}>{section}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>{active.sections[section]}</p>
          </Stub>
        </Card>
      </div>
    </div>
  );
}
