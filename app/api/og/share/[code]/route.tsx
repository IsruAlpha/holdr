import { NextResponse } from 'next/server'
import sharp from 'sharp'

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

  const userName = shareData?.userName || 'Someone'
  const allMovies: Array<{ poster: string; title: string }> = shareData?.movies || []
  const totalMovies = allMovies.length
  const moviesWithPosters = allMovies
    .filter((m) => m.poster && m.poster !== 'N/A' && m.poster.startsWith('http'))
    .slice(0, 6)

  const hasMovies = moviesWithPosters.length > 0

  const dots = [
    { size: 12, x: -25, y: -18 },
    { size: 7, x: -7, y: -22 },
    { size: 14, x: 10, y: -13 },
    { size: 5, x: 25, y: -25 },
    { size: 9, x: -18, y: 4 },
    { size: 10, x: 4, y: 7 },
    { size: 4, x: 18, y: -4 },
    { size: 7, x: -28, y: 11 },
    { size: 5, x: 28, y: 7 },
    { size: 9, x: -4, y: -6 },
  ]

  const dotsSvg = dots
    .map(
      (d) =>
        `<circle cx="${d.x}" cy="${d.y}" r="${d.size / 2}" fill="#18181b"/>`
    )
    .join('')

  const posterWidth = 140
  const posterHeight = 210
  const posterGap = 16
  const totalPosterWidth = moviesWithPosters.length * posterWidth + (moviesWithPosters.length - 1) * posterGap
  const posterStartX = (1200 - totalPosterWidth) / 2

  let postersSvg = ''
  if (hasMovies) {
    for (let i = 0; i < moviesWithPosters.length; i++) {
      const x = posterStartX + i * (posterWidth + posterGap)
      const y = 220
      try {
        const imgResponse = await fetch(moviesWithPosters[i].poster)
        if (imgResponse.ok) {
          const imgBuffer = Buffer.from(await imgResponse.arrayBuffer())
          const resized = await sharp(imgBuffer)
            .resize(posterWidth, posterHeight, { fit: 'cover' })
            .png()
            .toBuffer()
          const base64 = resized.toString('base64')
          postersSvg += `
            <defs>
              <clipPath id="poster-clip-${i}">
                <rect x="${x}" y="${y}" width="${posterWidth}" height="${posterHeight}" rx="12"/>
              </clipPath>
            </defs>
            <image x="${x}" y="${y}" width="${posterWidth}" height="${posterHeight}" href="data:image/png;base64,${base64}" clip-path="url(#poster-clip-${i})"/>
          `
        } else {
          postersSvg += `
            <rect x="${x}" y="${y}" width="${posterWidth}" height="${posterHeight}" rx="12" fill="#e4e4e7"/>
            <text x="${x + posterWidth / 2}" y="${y + posterHeight / 2}" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#a1a1aa">${moviesWithPosters[i].title}</text>
          `
        }
      } catch {
        postersSvg += `
          <rect x="${x}" y="${y}" width="${posterWidth}" height="${posterHeight}" rx="12" fill="#e4e4e7"/>
          <text x="${x + posterWidth / 2}" y="${y + posterHeight / 2}" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#a1a1aa">${moviesWithPosters[i].title}</text>
        `
      }
    }
  }

  const titleText = hasMovies
    ? `Movies shared by ${userName}`
    : `${userName}'s watchlist`
  const titleColor = '#18181b'
  const subtitleColor = '#71717a'

  const footerText = totalMovies > 0
    ? `${totalMovies} movie${totalMovies !== 1 ? 's' : ''} \u00B7 holdr.linkroot.space`
    : 'Shared on \u00B7 holdr.linkroot.space'

  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#FAF5EE"/>

      <g transform="translate(600, ${hasMovies ? 90 : 230})">
        <text x="-46" y="14" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="900" fill="${titleColor}">{</text>
        <g transform="translate(0, 0)">
          ${dotsSvg}
        </g>
        <text x="46" y="14" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="900" fill="${titleColor}">}</text>
      </g>

      <text x="600" y="${hasMovies ? 160 : 300}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="700" fill="${titleColor}" letter-spacing="-0.5">Holdr</text>

      <text x="600" y="${hasMovies ? 200 : 340}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="24" fill="${subtitleColor}">${titleText}</text>

      ${postersSvg}

      <text x="600" y="580" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="#a1a1aa">${footerText}</text>
    </svg>
  `

  const png = await sharp(Buffer.from(svg)).png().toBuffer()

  return new NextResponse(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
