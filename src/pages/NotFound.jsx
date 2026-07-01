// src/pages/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/Shared';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <EmptyState
      icon="search"
      title="Page not found"
      body="That module doesn't exist yet."
      action={<button className="start-btn" onClick={() => navigate('/')}>Back to dashboard</button>}
    />
  );
}
