// src/pages/AiTutor.jsx
import React, { useState, useRef, useEffect } from 'react';
import { PageHeader, Card } from '../components/Shared';
import Icon from '../components/Icon';

function fakeReply(message) {
  const m = message.toLowerCase();
  if (m.includes('photosynthesis')) return 'Photosynthesis converts light energy into chemical energy (glucose) using carbon dioxide and water, releasing oxygen as a by-product. Want a labelled diagram or practice questions on this topic?';
  if (m.includes('mitochondri')) return 'The mitochondrion is the site of aerobic respiration — it produces ATP via the electron transport chain. It is often called the "powerhouse of the cell."';
  if (m.includes('quadratic') || m.includes('algebra')) return 'For a quadratic ax² + bx + c = 0, you can solve by factorising, completing the square, or the quadratic formula: x = (-b ± √(b²-4ac)) / 2a. Want me to work through an example?';
  return "I'm Clara — right now I only have a small set of canned answers wired up as a scaffold (try asking about photosynthesis, mitochondria, or quadratics). Hooking me up to a real LLM (e.g. the Anthropic API) is the next step — see the note below the chat.";
}

export default function AiTutor() {
  const [messages, setMessages] = useState([
    { from: 'ai', text: "Hi, I'm Clara, your AI tutor. Ask me about anything you're studying." },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  function send(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'ai', text: fakeReply(userMsg.text) }]);
    }, 500);
  }

  return (
    <div>
      <PageHeader eyebrow="AI TUTOR" title="Clara" description="A persistent study assistant. Currently scaffolded with canned answers — see note below for wiring a real model." />

      <Card style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', height: 460, padding: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
              <div style={{
                maxWidth: '78%',
                padding: '9px 13px',
                borderRadius: 10,
                fontSize: 13.5,
                lineHeight: 1.5,
                background: m.from === 'user' ? 'var(--green)' : 'var(--paper)',
                color: m.from === 'user' ? 'var(--gold-tint)' : 'var(--ink)',
              }}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <form onSubmit={send} style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid var(--line)' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Clara something…"
            style={{ flex: 1, padding: '9px 12px', border: '1px solid var(--line)', borderRadius: 6 }}
          />
          <button type="submit" className="icon-btn" style={{ background: 'var(--gold)', color: 'var(--green)' }}><Icon name="send" size={16} /></button>
        </form>
      </Card>

      <Card style={{ marginTop: 16, maxWidth: 640, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6 }}>
        <strong>Wiring a real tutor:</strong> swap <code>fakeReply()</code> for a call to an LLM API (e.g. Anthropic's Messages API) from a small backend — never call a model API with a secret key directly from this static frontend. Pass the student's current subject/topic context (from <code>storage.getProfile()</code> and the active question) along with the message so answers stay grounded in the syllabus.
      </Card>
    </div>
  );
}
