// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { PageHeader, Card } from '../components/Shared';
import { storage } from '../lib/storage';
import { loadManifest } from '../lib/questionBank';

export default function Profile() {
  const [profile, setProfile] = useState(storage.getProfile());
  const [subjects, setSubjects] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadManifest().then(setSubjects); }, []);

  function update(field, value) {
    setProfile((p) => ({ ...p, [field]: value }));
    setSaved(false);
  }

  function toggleSubject(code) {
    setProfile((p) => ({
      ...p,
      subjects: p.subjects.includes(code) ? p.subjects.filter((c) => c !== code) : [...p.subjects, code],
    }));
    setSaved(false);
  }

  function save() {
    storage.setProfile(profile);
    setSaved(true);
  }

  return (
    <div>
      <PageHeader eyebrow="PROFILE" title="Your profile" description="Stored locally on this device — no account or server involved yet." />

      <Card style={{ maxWidth: 560 }}>
        <div className="profile-grid">
          <label>Name<input value={profile.name} onChange={(e) => update('name', e.target.value)} /></label>
          <label>Email<input value={profile.email} onChange={(e) => update('email', e.target.value)} /></label>
          <label>Phone<input value={profile.phone} onChange={(e) => update('phone', e.target.value)} /></label>
          <label>Country<input value={profile.country} onChange={(e) => update('country', e.target.value)} /></label>
          <label>State<input value={profile.state} onChange={(e) => update('state', e.target.value)} /></label>
          <label>School<input value={profile.school} onChange={(e) => update('school', e.target.value)} /></label>
        </div>

        <div className="field-label" style={{ marginTop: 18 }}>Subject combination</div>
        <div className="chip-row">
          {subjects.map((s) => (
            <button key={s.code} className={'chip' + (profile.subjects.includes(s.code) ? ' chip-active' : '')} onClick={() => toggleSubject(s.code)}>
              {s.name}
            </button>
          ))}
        </div>

        <button className="start-btn" style={{ marginTop: 20 }} onClick={save}>Save profile</button>
        {saved && <span style={{ marginLeft: 12, color: 'var(--green)', fontSize: 13 }}>Saved ✓</span>}
      </Card>
    </div>
  );
}
