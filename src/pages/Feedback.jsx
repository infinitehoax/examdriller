// src/pages/Feedback.jsx
import React, { useState } from 'react';
import { PageHeader, Card } from '../components/Shared';

const TYPES = ['Commendation', 'Business', 'Error Report', 'Pricing', 'Others'];

export default function Feedback() {
  const [type, setType] = useState('Commendation');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function submit() {
    // No backend yet — this is a local acknowledgement only.
    setSent(true);
    setMessage('');
  }

  return (
    <div>
      <PageHeader eyebrow="FEEDBACK" title="Send feedback" description="Tell us what's working, what's broken, or what you'd pay for." />

      <Card style={{ maxWidth: 540 }}>
        <div className="field-label">Type</div>
        <div className="chip-row" style={{ marginBottom: 16 }}>
          {TYPES.map((t) => (
            <button key={t} className={'chip chip-small' + (type === t ? ' chip-active' : '')} onClick={() => setType(t)}>{t}</button>
          ))}
        </div>
        <div className="field-label">Message</div>
        <textarea
          className="theory-answer"
          style={{ minHeight: 110 }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message…"
        />
        <button className="start-btn" onClick={submit} disabled={!message.trim()}>Send</button>
        {sent && <p style={{ color: 'var(--green)', fontSize: 13, marginTop: 10 }}>Thanks — noted locally (there's no admin backend in this scaffold yet).</p>}
      </Card>
    </div>
  );
}
