import { ImageResponse } from 'next/og'

async function getShareData(identifier: string) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
  if (!convexUrl) return null

  try {
    const codeResponse = await fetch(`${convexUrl}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: 'shareLinks:getMoviesByShareCode',
        args: { code: identifier },
      }),
    })

    if (codeResponse.ok) {
      const codeData = await codeResponse.json()
      if (codeData.value) return codeData.value
    }

    const userIdResponse = await fetch(`${convexUrl}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: 'shareLinks:getMoviesByUserId',
        args: { userId: identifier },
      }),
    })

    if (userIdResponse.ok) {
      const userIdData = await userIdResponse.json()
      if (userIdData.value) return userIdData.value
    }

    return null
  } catch {
    return null
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const shareData = await getShareData(code)

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

  const userName = shareData?.userName || 'Someone'
  const allMovies = shareData?.movies || []
  const totalMovies = allMovies.length
  const moviesWithPosters = allMovies
    .filter((m: { poster: string }) => m.poster && m.poster !== 'N/A' && m.poster.startsWith('http'))
    .slice(0, 6)

  const hasMovies = moviesWithPosters.length > 0

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#FAF5EE',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: hasMovies ? '48px' : '0',
          }}
        >
          <span style={{ fontSize: '72px', fontWeight: 900, color: '#18181b', lineHeight: 1 }}>
            {'{'}
          </span>
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
          <span style={{ fontSize: '72px', fontWeight: 900, color: '#18181b', lineHeight: 1 }}>
            {'}'}
          </span>
        </div>

        <div
          style={{
            fontSize: '48px',
            fontWeight: 700,
            color: '#18181b',
            marginTop: '16px',
            letterSpacing: '-1px',
          }}
        >
          Holdr
        </div>

        <div
          style={{
            fontSize: '26px',
            color: '#71717a',
            marginTop: '24px',
            textAlign: 'center',
          }}
        >
          {hasMovies ? (
            <>
              Movies shared by{' '}
              <span style={{ color: '#18181b', fontWeight: 600 }}>{userName}</span>
            </>
          ) : (
            <>{userName}&apos;s watchlist</>
          )}
        </div>

        {hasMovies && (
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '32px',
              justifyContent: 'center',
            }}
          >
            {moviesWithPosters.map(
              (movie: { poster: string; title: string }, i: number) => (
                <div
                  key={i}
                  style={{
                    width: '140px',
                    height: '210px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#e4e4e7',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )
            )}
          </div>
        )}

        <div
          style={{
            fontSize: '18px',
            color: '#a1a1aa',
            marginTop: 'auto',
            marginBottom: '48px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {totalMovies > 0 && (
            <span>
              {totalMovies} movie{totalMovies !== 1 ? 's' : ''}
            </span>
          )}
          {totalMovies > 0 && <span>·</span>}
          <span>holdr.linkroot.space</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
