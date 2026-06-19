import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Monster Depot Market — Got Munchies?'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=block`
  const css = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  }).then(r => r.text())
  const fontUrl = css.match(/src: url\(([^)]+)\) format\('woff2'\)/)?.[1]
  if (!fontUrl) throw new Error('Could not parse Syne font URL')
  return fetch(fontUrl).then(r => r.arrayBuffer())
}

export default async function Image() {
  const syne = await loadGoogleFont('Syne', 800)

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
            fontFamily: '"Syne"',
            fontWeight: 800,
            fontSize: 104,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            lineHeight: 1,
            margin: 0,
          }}
        >
          Monster Depot
        </p>
        <p
          style={{
            fontFamily: '"Syne"',
            fontWeight: 800,
            fontSize: 44,
            letterSpacing: '-0.02em',
            color: '#C084FC',
            margin: '20px 0 0',
          }}
        >
          Got Munchies?
        </p>
        <p
          style={{
            fontFamily: 'sans-serif',
            fontSize: 18,
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
      fonts: [{ name: 'Syne', data: syne, weight: 800, style: 'normal' }],
    }
  )
}
