// src/pages/ScienceNote.jsx
import React, { useRef, useState, useEffect } from 'react';
import { PageHeader, Card, Stub } from '../components/Shared';
import Icon from '../components/Icon';
import { storage } from '../lib/storage';

export default function ScienceNote() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [history, setHistory] = useState([]);
  const [savedNotes, setSavedNotes] = useState(storage.getScienceNotes());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  function pos(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function snapshot() {
    setHistory((h) => [...h, canvasRef.current.toDataURL()]);
  }

  function start(e) {
    snapshot();
    setDrawing(true);
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function move(e) {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = pos(e);
    ctx.lineWidth = tool === 'eraser' ? 18 : 2;
    ctx.strokeStyle = tool === 'eraser' ? '#fff' : '#0B3D2E';
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function end() { setDrawing(false); }

  function undo() {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    const img = new Image();
    img.onload = () => canvasRef.current.getContext('2d').drawImage(img, 0, 0);
    img.src = last;
    setHistory((h) => h.slice(0, -1));
  }

  function clear() {
    snapshot();
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }

  function save() {
    const dataUrl = canvasRef.current.toDataURL();
    const notes = storage.saveScienceNote({ dataUrl });
    setSavedNotes(notes);
  }

  return (
    <div>
      <PageHeader eyebrow="SCIENCE NOTE" title="Digital whiteboard" description="Freehand drawing, eraser, undo, and clear are functional. Text insertion and formula/graph plotting are scaffolded next." />

      <div className="chip-row" style={{ marginBottom: 14 }}>
        <button className={'chip' + (tool === 'pen' ? ' chip-active' : '')} onClick={() => setTool('pen')}><Icon name="pencil" size={13} /> Pen</button>
        <button className={'chip' + (tool === 'eraser' ? ' chip-active' : '')} onClick={() => setTool('eraser')}>Eraser</button>
        <button className="chip" onClick={undo}>Undo</button>
        <button className="chip" onClick={clear}>Clear</button>
        <button className="chip" onClick={save}>Save</button>
      </div>

      <Card style={{ padding: 8 }}>
        <canvas
          ref={canvasRef}
          width={760}
          height={420}
          style={{ width: '100%', border: '1px solid var(--line)', borderRadius: 4, touchAction: 'none', cursor: 'crosshair' }}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
        />
      </Card>

      <Stub moduleName="Add text & plot graphs" blurb="Text-box insertion and formula/graph plotting (e.g. y = x squared, titration curves) aren't wired up yet — drawing-only for now.">
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>Saved notes this session: {savedNotes.length}</p>
      </Stub>
    </div>
  );
}
