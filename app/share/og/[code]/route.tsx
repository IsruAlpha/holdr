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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '48px', fontWeight: 900, color: '#18181b' }}>{'{'}</div>
          <div style={{ position: 'relative', width: '60px', height: '60px' }}>
            <div style={{ position: 'absolute', top: '5px', left: '10px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#18181b' }} />
            <div style={{ position: 'absolute', top: '0px', left: '25px', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#18181b' }} />
            <div style={{ position: 'absolute', top: '15px', left: '35px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#18181b' }} />
            <div style={{ position: 'absolute', top: '25px', left: '5px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#18181b' }} />
            <div style={{ position: 'absolute', top: '35px', left: '20px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#18181b' }} />
            <div style={{ position: 'absolute', top: '45px', left: '40px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#18181b' }} />
          </div>
          <div style={{ fontSize: '48px', fontWeight: 900, color: '#18181b' }}>{'}'}</div>
        </div>
        <div style={{ fontSize: '36px', fontWeight: 700, color: '#18181b', marginTop: '16px' }}>Holdr</div>
        <div style={{ fontSize: '20px', color: '#71717a', marginTop: '8px' }}>Shared Movie Watchlist</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
