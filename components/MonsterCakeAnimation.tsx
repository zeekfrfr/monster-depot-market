type Variant = 'home' | 'flavor'

interface MonsterCakeAnimationProps {
  variant: Variant
}

/**
 * Signature visual: a bold cartoonish mug whose cobalt liquid blooms into deep
 * purple. The bloom is a soft-edged purple <circle> that GROWS from the liquid's
 * centre via a CSS transform: scale() animation over a cobalt base — CSS
 * transforms animate organically in every engine (incl. Safari), unlike SVG
 * SMIL or CSS stop-color transitions. A glow behind the mug crossfades
 * cobalt -> purple and pulses on a loop. Pure CSS; respects prefers-reduced-motion.
 */
export default function MonsterCakeAnimation({ variant }: MonsterCakeAnimationProps) {
  const isFlavor = variant === 'flavor'
  const mugSize = isFlavor ? 'min(60vw, 360px)' : 'min(40vw, 240px)'
  const bloomMs = isFlavor ? 2500 : 2000

  const uid = isFlavor ? 'flavor' : 'home'
  const clipId = `mca-clip-${uid}`
  const bloomGradId = `mca-bloom-${uid}`

  const cobalt = '#0A1F5C'
  const purple = '#3B0764'

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
      {/* Glow behind the mug — wrapper pulses opacity; inner layers crossfade colour. */}
      <div
        aria-hidden="true"
        className="mca-glow"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '180%',
          height: '180%',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <div
          className="mca-glow-cobalt"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'var(--radius-full)',
            background: `radial-gradient(circle at center, ${cobalt} 0%, rgba(10,31,92,0) 70%)`,
            filter: 'blur(80px)',
          }}
        />
        <div
          className="mca-glow-purple"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'var(--radius-full)',
            background: `radial-gradient(circle at center, ${purple} 0%, rgba(59,7,100,0) 70%)`,
            filter: 'blur(80px)',
          }}
        />
      </div>

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
          {/* Soft radial edge so the growing circle reads as liquid, not a hard disc. */}
          <radialGradient id={bloomGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={purple} stopOpacity="1" />
            <stop offset="70%" stopColor={purple} stopOpacity="0.95" />
            <stop offset="100%" stopColor={purple} stopOpacity="0" />
          </radialGradient>

          {/* Clip the liquid to the inner mug body so it never spills. */}
          <clipPath id={clipId}>
            <path d="M 26 30 L 84 30 L 80 96 Q 79 104 71 104 L 39 104 Q 31 104 30 96 Z" />
          </clipPath>
        </defs>

        {/* Liquid — cobalt base + purple bloom growing from the centre, clipped to mug. */}
        <g clipPath={`url(#${clipId})`}>
          <rect x="20" y="51" width="80" height="60" fill={cobalt} />
          <circle className="mca-bloom" cx="55" cy="80" r="46" fill={`url(#${bloomGradId})`} />
          {/* Subtle surface line at the top of the liquid. */}
          <line x1="26" y1="51" x2="84" y2="51" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.35" />
        </g>

        {/* Mug body outline — bold white stroke, no fill. */}
        <path
          d="M 26 30 L 84 30 L 80 96 Q 79 104 71 104 L 39 104 Q 31 104 30 96 Z"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Rim ellipse. */}
        <ellipse cx="55" cy="30" rx="29" ry="7" fill="none" stroke="#FFFFFF" strokeWidth="2" />
        {/* Handle on the right. */}
        <path d="M 83 44 Q 104 44 104 62 Q 104 80 80 82" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
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
          Add your liquid. Watch it change.
        </p>
      )}

      <style>{`
        .mca-glow {
          opacity: 0.15;
          animation: mcaGlowPulse 3000ms ease-in-out infinite;
        }
        .mca-glow-purple { opacity: 0; animation: mcaFadeIn ${bloomMs}ms ease-in-out 600ms forwards; }
        .mca-glow-cobalt { opacity: 1; animation: mcaFadeOut ${bloomMs}ms ease-in-out 600ms forwards; }
        .mca-bloom {
          transform-box: fill-box;
          transform-origin: center;
          transform: scale(0);
          animation: mcaBloom ${bloomMs}ms cubic-bezier(0.4, 0, 0.2, 1) 600ms forwards;
        }
        @keyframes mcaGlowPulse { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.35; } }
        @keyframes mcaFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes mcaFadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes mcaBloom { from { transform: scale(0); } to { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) {
          .mca-glow { animation: none; opacity: 0.28; }
          .mca-glow-purple { animation: none; opacity: 1; }
          .mca-glow-cobalt { animation: none; opacity: 0; }
          .mca-bloom { animation: none; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
