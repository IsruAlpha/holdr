import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '64px', fontWeight: 900, color: '#18181b', lineHeight: 1 }}>{'{'}</div>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="20" cy="15" r="8" fill="#18181b"/>
            <circle cx="40" cy="10" r="5" fill="#18181b"/>
            <circle cx="55" cy="20" r="10" fill="#18181b"/>
            <circle cx="15" cy="35" r="6" fill="#18181b"/>
            <circle cx="35" cy="40" r="7" fill="#18181b"/>
            <circle cx="55" cy="45" r="4" fill="#18181b"/>
            <circle cx="25" cy="55" r="5" fill="#18181b"/>
            <circle cx="45" cy="60" r="8" fill="#18181b"/>
            <circle cx="65" cy="55" r="3" fill="#18181b"/>
            <circle cx="10" cy="60" r="4" fill="#18181b"/>
          </svg>
          <div style={{ fontSize: '64px', fontWeight: 900, color: '#18181b', lineHeight: 1 }}>{'}'}</div>
        </div>
        <div style={{ fontSize: '48px', fontWeight: 700, color: '#18181b', marginTop: '24px' }}>Holdr</div>
        <div style={{ fontSize: '28px', color: '#71717a', marginTop: '8px' }}>Shared Movie Watchlist</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
