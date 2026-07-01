// src/components/Icon.jsx
import React from 'react';

const PATHS = {
  target: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm0 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z',
  book: 'M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5v-17ZM20 19H6.5a1 1 0 0 0-1 1',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 17-5.6-5.6',
  flag: 'M5 21V4m0 0h12l-2.5 4L17 12H5',
  chart: 'M4 20V10m6 10V4m6 16v-7m6 7H2',
  history: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5M12 8v4l3 2',
  calendar: 'M4 6h16v15H4V6Zm0 0V4m16 2V4M8 4v4m8-4v4M4 11h16',
  game: 'M7 9h2v2H7V9Zm0 0v2m8-2h2v2M2 10c0-2 1-4 4-4h12c3 0 4 2 4 4l-1.5 8c-.2 1-1 1.5-2 1.5-.7 0-1.3-.4-1.6-1L16 17H8l-1 1.5c-.3.6-.9 1-1.6 1-1 0-1.8-.5-2-1.5L2 10Z',
  trophy: 'M8 3h8v4a4 4 0 0 1-8 0V3Zm-3 1H3v2a3 3 0 0 0 3 3M19 4h2v2a3 3 0 0 1-3 3M8 14h8v3a4 4 0 0 1-4 4 4 4 0 0 1-4-4v-3Zm4 7v3m-4 0h8',
  feather: 'M20 4 9 15M20 4c-7 0-13 4-15 11l5 5C17 18 20 11 20 4Z',
  report: 'M6 2h9l4 4v16H6V2Zm9 0v4h4M9 12h6m-6 4h6m-6-8h2',
  dictionary: 'M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4Zm0 0v16M9 8h6m-6 4h4',
  pencil: 'm14 4 4 4L7 19l-4 1 1-4L14 4Z',
  bookmark: 'M6 3h12v18l-6-4-6 4V3Z',
  bell: 'M12 2a6 6 0 0 0-6 6v3.5c0 .8-.3 1.6-.9 2.2L4 15h16l-1.1-1.3a3.2 3.2 0 0 1-.9-2.2V8a6 6 0 0 0-6-6Zm-2 16a2 2 0 0 0 4 0',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-5 0-8 2.5-8 5.5V21h16v-1.5c0-3-3-5.5-8-5.5Z',
  chevronDown: 'm6 9 6 6 6-6',
  close: 'M6 6l12 12M18 6 6 18',
  check: 'm5 13 4 4L19 7',
  calc: 'M5 2h14v20H5V2Zm0 6h14M9 12h.01M12 12h.01M15 12h.01M9 15h.01M12 15h.01M15 15h.01M9 18h.01M12 18h.01M15 18h6',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 5v5l3 3',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z',
  star: 'm12 2 3 7h7l-5.5 4.5L18.5 21 12 17l-6.5 4 2-7.5L2 9h7l3-7Z',
  speaker: 'M3 9v6h4l5 5V4L7 9H3Zm13.5-2a5 5 0 0 1 0 10M19 5a8 8 0 0 1 0 14',
  play: 'M6 4l14 8-14 8V4Z',
  plus: 'M12 5v14M5 12h14',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
};

export default function Icon({ name, size = 18, strokeWidth = 1.8, className = '', style }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
