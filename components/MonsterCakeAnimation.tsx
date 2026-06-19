'use client'

import { useEffect, useState } from 'react'

type Variant = 'home' | 'flavor'

interface MonsterCakeAnimationProps {
  variant: Variant
}

/**
 * Signature visual: a bold cartoonish mug whose liquid blooms from cobalt blue
 * (#0A1F5C) to deep purple (#3B0764) on mount via an expanding radial gradient.
 * A soft glow behind the mug pulses opacity on a loop.
 *
 * Animations are CSS only and respect prefers-reduced-motion (handled globally).
 */
export default function MonsterCakeAnimation({ variant }: MonsterCakeAnimationProps) {
  const [bloomed, setBloomed] = useState(false)

  // Trigger the color bloom 600ms after mount.
  useEffect(() => {
    const id = window.setTimeout(() => setBloomed(true), 600)
    return () => window.clearTimeout(id)
  }, [])

  const isFlavor = variant === 'flavor'

  // Mug sizing per variant.
  const mugSize = isFlavor ? 'min(60vw, 360px)' : 'min(40vw, 240px)'

  // Bloom transition duration per variant.
  const bloomDuration = isFlavor ? '2500ms' : '2000ms'

  // Start (cobalt) and end (deep purple) liquid colors.
  const startColor = '#0A1F5C'
  const endColor = '#3B0764'
  const currentColor = bloomed ? endColor : startColor

  // Unique ids so multiple instances on a page don't collide.
  const uid = isFlavor ? 'flavor' : 'home'
  const liquidGradId = `mca-liquid-${uid}`
  const liquidClipId = `mca-clip-${uid}`

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Glow behind the mug — same color family as the current liquid. */}
      <div
        aria-hidden="true"
        className="anim-glow-pulse"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '180%',
          height: '180%',
          transform: 'translate(-50%, -50%)',
          borderRadius: 'var(--radius-full)',
          background: `radial-gradient(circle at center, ${currentColor} 0%, rgba(10,31,92,0) 70%)`,
          filter: 'blur(80px)',
          // Smoothly carry the glow color along with the liquid bloom.
          transition: `background ${bloomDuration} ease-in-out`,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Mug */}
      <svg
        role="img"
        aria-label="A mug of liquid blooming from cobalt blue to deep purple"
        viewBox="0 0 120 120"
        style={{
          position: 'relative',
          zIndex: 1,
          width: mugSize,
          height: 'auto',
          display: 'block',
          overflow: 'visible',
        }}
      >
        <defs>
          {/*
            Radial gradient that expands from the center to look like color
            emerging from within. We animate the STOP COLORS via the `bloomed`
            class so the deep purple blooms outward through the cobalt.
          */}
          <radialGradient id={liquidGradId} cx="50%" cy="50%" r="65%">
            <stop
              offset="0%"
              stopColor={bloomed ? endColor : startColor}
              style={{ transition: `stop-color ${bloomDuration} ease-in-out` }}
            />
            <stop
              offset="55%"
              stopColor={bloomed ? endColor : startColor}
              style={{
                transition: `stop-color ${bloomDuration} ease-in-out`,
                transitionDelay: isFlavor ? '300ms' : '250ms',
              }}
            />
            <stop
              offset="100%"
              stopColor={startColor}
              style={{
                transition: `stop-color ${bloomDuration} ease-in-out`,
                transitionDelay: isFlavor ? '600ms' : '500ms',
              }}
            />
          </radialGradient>

          {/* Clip the liquid to the inner mug body so it never spills. */}
          <clipPath id={liquidClipId}>
            <path d="M 26 30 L 84 30 L 80 96 Q 79 104 71 104 L 39 104 Q 31 104 30 96 Z" />
          </clipPath>
        </defs>

        {/* Liquid — fills ~70% of the interior, clipped to mug body. */}
        <g clipPath={`url(#${liquidClipId})`}>
          <rect
            x="20"
            y="51"
            width="80"
            height="60"
            fill={`url(#${liquidGradId})`}
          />
          {/* Subtle surface line at the top of the liquid. */}
          <line
            x1="26"
            y1="51"
            x2="84"
            y2="51"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeOpacity="0.35"
          />
        </g>

        {/* Mug body outline — bold white stroke, no fill. */}
        <path
          d="M 26 30 L 84 30 L 80 96 Q 79 104 71 104 L 39 104 Q 31 104 30 96 Z"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Rim ellipse — gives the cylindrical, slightly-cartoonish look. */}
        <ellipse
          cx="55"
          cy="30"
          rx="29"
          ry="7"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
        />

        {/* Handle on the right. */}
        <path
          d="M 83 44 Q 104 44 104 62 Q 104 80 80 82"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {isFlavor && (
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: '13px',
            color: 'rgba(0,0,0,0.6)',
            textAlign: 'center',
            marginTop: '16px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Add water. Watch it change.
        </p>
      )}

      <style>{`
        @keyframes mcaGlowPulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }
        .anim-glow-pulse {
          opacity: 0.15;
          animation: mcaGlowPulse 3000ms ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .anim-glow-pulse {
            animation: none;
            opacity: 0.25;
          }
        }
      `}</style>
    </div>
  )
}
