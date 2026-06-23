import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Monster Depot Market — Got Munchies?'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Pull the brand display font (Syne 800). An old User-Agent makes the Google
// Fonts CSS endpoint return a TTF URL — next/og (satori) renders TTF/OTF/WOFF
// but NOT woff2, so we must avoid the modern woff2 response.
async function loadSyne(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch('https://fonts.googleapis.com/css2?family=Syne:wght@800', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64)' },
    }).then((r) => r.text())
    const url = css.match(/src:\s*url\((https:\/\/[^)]+)\)\s*format\('(?:truetype|opentype)'\)/)?.[1]
    if (!url) return null
    return await fetch(url).then((r) => r.arrayBuffer())
  } catch {
    return null
  }
}

export default async function Image() {
  const syne = await loadSyne()
  const font = syne ? 'Syne' : 'sans-serif'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#2D1B69',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <p
          style={{
            fontFamily: font,
            fontWeight: 800,
            fontSize: 132,
            letterSpacing: '-0.04em',
            color: '#FFFFFF',
            lineHeight: 1,
            margin: 0,
          }}
        >
          Got Munchies?
        </p>
        <p
          style={{
            fontFamily: font,
            fontWeight: 800,
            fontSize: 38,
            letterSpacing: '0.16em',
            color: '#C084FC',
            textTransform: 'uppercase',
            margin: '28px 0 0',
          }}
        >
          Monster Depot Market
        </p>
        <p
          style={{
            fontFamily: 'sans-serif',
            fontSize: 20,
            letterSpacing: '0.18em',
            color: 'rgba(255,255,255,0.45)',
            textTransform: 'uppercase',
            margin: 0,
            position: 'absolute',
            bottom: 52,
          }}
        >
          monsterdepotmarket.com
        </p>
      </div>
    ),
    {
      ...size,
      ...(syne ? { fonts: [{ name: 'Syne', data: syne, weight: 800 as const, style: 'normal' as const }] } : {}),
    },
  )
}
