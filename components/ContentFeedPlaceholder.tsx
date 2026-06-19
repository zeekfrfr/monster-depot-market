// TODO: Replace with TikTok or Instagram embed when accounts are live.
// Embed the full feed showing all recipe content across all flavors.
import type { CSSProperties } from 'react';

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-2)',
  width: '100%',
  height: 'clamp(400px, 60vw, 500px)',
  border: '2px dashed var(--text-disabled)',
  borderRadius: 'var(--radius-lg)',
  background: 'var(--surface-white)',
  padding: 'var(--space-4)',
  textAlign: 'center',
};

const labelStyle: CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontWeight: 400,
  fontSize: '15px',
  color: 'var(--text-tertiary)',
  margin: 0,
};

export default function ContentFeedPlaceholder() {
  return (
    <div style={containerStyle} role="img" aria-label="Social feed placeholder. TikTok and Instagram recipe content will load here.">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--text-tertiary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
      <p style={labelStyle}>TikTok / Instagram feed loads here</p>
    </div>
  );
}
