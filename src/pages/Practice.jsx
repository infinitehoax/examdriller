// src/pages/Practice.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Card } from '../components/Shared';
import { loadManifest, loadSubject } from '../lib/questionBank';
import './Practice.css';

export default function Practice() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [topicsBySubject, setTopicsBySubject] = useState({});
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [mode, setMode] = useState('objective');
  const [testMode, setTestMode] = useState('practice');
  const [numQuestions, setNumQuestions] = useState(10);
  const [duration, setDuration] = useState(20);
  const [shuffleQ, setShuffleQ] = useState(true);
  const [shuffleO, setShuffleO] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const subs = await loadManifest();
      setSubjects(subs);
      const topicMap = {};
      for (const s of subs) {
        const bank = await loadSubject(s.code);
        topicMap[s.code] = bank.topics;
      }
      setTopicsBySubject(topicMap);
      setLoading(false);
    })();
  }, []);

  function toggleSubject(code) {
    setSelectedSubjects((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
    setSelectedTopics([]);
  }

  function toggleTopic(topic) {
    setSelectedTopics((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]));
  }

  function startExam() {
    const config = {
      subjects: selectedSubjects.length ? selectedSubjects : subjects.map((s) => s.code),
      topics: selectedTopics,
      mode,
      testMode,
      numQuestions,
      duration,
      shuffleQ,
      shuffleO,
    };
    sessionStorage.setItem('testdriller:examConfig', JSON.stringify(config));
    navigate('/practice/exam');
  }

  const availableTopics = selectedSubjects.length
    ? [...new Set(selectedSubjects.flatMap((c) => topicsBySubject[c] || []))]
    : [...new Set(Object.values(topicsBySubject).flat())];

  return (
    <div>
      <PageHeader
        eyebrow="PRACTICE FOR WASSCE"
        title="Exam Simulator"
        description="Choose your subjects, mode, and constraints, then sit a timed simulation drawn from the question bank."
      />

      {loading ? (
        <Card>Loading subjects…</Card>
      ) : (
        <div className="practice-setup">
          <Card>
            <div className="field-label">Subject(s)</div>
            <div className="chip-row">
              {subjects.map((s) => (
                <button
                  key={s.code}
                  className={'chip' + (selectedSubjects.includes(s.code) ? ' chip-active' : '')}
                  onClick={() => toggleSubject(s.code)}
                >
                  {s.name}
                </button>
              ))}
            </div>

            <div className="field-label" style={{ marginTop: 18 }}>Topics (optional)</div>
            <div className="chip-row">
              {availableTopics.map((t) => (
                <button
                  key={t}
                  className={'chip chip-small' + (selectedTopics.includes(t) ? ' chip-active' : '')}
                  onClick={() => toggleTopic(t)}
                >
                  {t}
                </button>
              ))}
              {availableTopics.length === 0 && <span className="muted-note">Pick a subject to see its topics.</span>}
            </div>
          </Card>

          <Card style={{ marginTop: 16 }}>
            <div className="setup-row">
              <div>
                <div className="field-label">Mode</div>
                <div className="toggle-pair">
                  <button className={mode === 'objective' ? 'toggle-active' : ''} onClick={() => setMode('objective')}>Objective</button>
                  <button className={mode === 'theory' ? 'toggle-active' : ''} onClick={() => setMode('theory')}>Theory</button>
                </div>
              </div>
              <div>
                <div className="field-label">Test mode</div>
                <select value={testMode} onChange={(e) => setTestMode(e.target.value)}>
                  <option value="practice">Practice</option>
                  <option value="study">Study</option>
                  <option value="mock">Mock</option>
                </select>
              </div>
              <div>
                <div className="field-label">Number of questions</div>
                <input type="number" min={1} max={50} value={numQuestions} onChange={(e) => setNumQuestions(+e.target.value)} />
              </div>
              <div>
                <div className="field-label">Duration (minutes)</div>
                <input type="number" min={1} max={180} value={duration} onChange={(e) => setDuration(+e.target.value)} />
              </div>
            </div>

            <div className="setup-row" style={{ marginTop: 16 }}>
              <label className="checkbox-row">
                <input type="checkbox" checked={shuffleQ} onChange={(e) => setShuffleQ(e.target.checked)} /> Shuffle questions
              </label>
              <label className="checkbox-row">
                <input type="checkbox" checked={shuffleO} onChange={(e) => setShuffleO(e.target.checked)} /> Shuffle options
              </label>
            </div>
          </Card>

          <button className="start-btn" onClick={startExam}>Start exam</button>
        </div>
      )}
    </div>
  );
}
