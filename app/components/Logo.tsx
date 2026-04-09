'use client';

import { useId } from 'react';

interface LogoProps {
  width?: number;
  height?: number;
}

export default function Logo({ width = 130, height = 33 }: LogoProps) {
  const uid = useId().replace(/:/g, '');
  const bgId   = `logoBg-${uid}`;
  const bzId   = `logoBz-${uid}`;

  return (
    <svg
      viewBox="0 0 240 60"
      fill="none"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="BuildZn"
      style={{
        display: 'block',
        width,
        height,
        minWidth: width,
        flexShrink: 0,
      }}
    >
      <defs>
        {/* Icon tile background: purple → cyan diagonal */}
        <linearGradient id={bgId} x1="2" y1="4" x2="54" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>

        {/* BZ monogram: white → light periwinkle */}
        <linearGradient id={bzId} x1="10" y1="20" x2="46" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#bfdbfe" />
        </linearGradient>
      </defs>

      {/* ── Icon tile ── */}
      <rect x="2" y="4" width="52" height="52" rx="12" fill={`url(#${bgId})`} />

      {/* ── BZ monogram ── */}
      <text
        x="28"
        y="39"
        textAnchor="middle"
        fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontSize="24"
        fontWeight="800"
        letterSpacing="-1"
        fill={`url(#${bzId})`}
      >
        BZ
      </text>

      {/* ── Wordmark ── */}
      <text
        x="68"
        y="42"
        fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontSize="28"
        fontWeight="800"
        letterSpacing="-0.5"
        fill="#ffffff"
      >
        Build
      </text>
      <text
        x="140"
        y="42"
        fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontSize="28"
        fontWeight="800"
        letterSpacing="-0.5"
        fill="#a78bfa"
      >
        Zn
      </text>
    </svg>
  );
}
