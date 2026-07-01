// src/components/Shared.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';
import './Shared.css';

export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <div className="page-eyebrow mono">{eyebrow}</div>}
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-desc">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Tile({ icon, label, blurb, path }) {
  const navigate = useNavigate();
  return (
    <button className="tile" onClick={() => navigate(path)}>
      <div className="tile-icon"><Icon name={icon} size={20} /></div>
      <div className="tile-label">{label}</div>
      {blurb && <div className="tile-blurb">{blurb}</div>}
    </button>
  );
}

export function Card({ children, className = '', ...props }) {
  return <div className={'card ' + className} {...props}>{children}</div>;
}

export function Pill({ children, tone = 'default' }) {
  return <span className={'pill pill-' + tone}>{children}</span>;
}

export function EmptyState({ icon = 'search', title, body, action }) {
  return (
    <div className="empty-state">
      <Icon name={icon} size={28} />
      <h3>{title}</h3>
      <p>{body}</p>
      {action}
    </div>
  );
}

export function Stub({ moduleName, blurb, children }) {
  return (
    <div>
      <div className="stub-banner">
        <Icon name="pencil" size={14} />
        <span><strong>{moduleName}</strong> is scaffolded — layout and navigation work; deep functionality comes next.</span>
      </div>
      {blurb && <p className="page-desc" style={{ marginTop: 4 }}>{blurb}</p>}
      {children}
    </div>
  );
}

export function GradeBadge({ grade }) {
  return <span className={`grade-badge grade-${grade?.[0]?.toLowerCase()}`}>{grade}</span>;
}
