import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  const dots = [
    { size: 16, x: -35, y: -25 },
    { size: 10, x: -10, y: -30 },
    { size: 20, x: 15, y: -18 },
    { size: 8, x: 35, y: -35 },
    { size: 12, x: -25, y: 5 },
    { size: 14, x: 5, y: 10 },
    { size: 6, x: 25, y: -5 },
    { size: 10, x: -40, y: 15 },
    { size: 8, x: 40, y: 10 },
    { size: 12, x: -5, y: -8 },
  ]

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF5EE',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '72px', fontWeight: 900, color: '#18181b', lineHeight: 1 }}>{'{'}</span>
          <div style={{ position: 'relative', width: '80px', height: '80px' }}>
            {dots.map((dot, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `calc(50% + ${dot.x}px)`,
                  top: `calc(50% + ${dot.y}px)`,
                  width: `${dot.size}px`,
                  height: `${dot.size}px`,
                  borderRadius: '50%',
                  backgroundColor: '#18181b',
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: '72px', fontWeight: 900, color: '#18181b', lineHeight: 1 }}>{'}'}</span>
        </div>
        <div style={{ fontSize: '52px', fontWeight: 700, color: '#18181b', marginTop: '28px', letterSpacing: '-1px' }}>Holdr</div>
        <div style={{ fontSize: '26px', color: '#71717a', marginTop: '8px' }}>Share Movies</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
