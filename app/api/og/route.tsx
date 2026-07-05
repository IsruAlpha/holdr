import { NextResponse } from 'next/server'
import sharp from 'sharp'

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

  const dotsSvg = dots
    .map(
      (d) =>
        `<circle cx="${d.x}" cy="${d.y}" r="${d.size / 2}" fill="#18181b"/>`
    )
    .join('')

  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#FAF5EE"/>

      <g transform="translate(600, 230)">
        <text x="-62" y="18" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="72" font-weight="900" fill="#18181b">{</text>
        <g transform="translate(0, 0)">
          ${dotsSvg}
        </g>
        <text x="62" y="18" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="72" font-weight="900" fill="#18181b">}</text>
      </g>

      <text x="600" y="330" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="700" fill="#18181b" letter-spacing="-1">Holdr</text>
      <text x="600" y="370" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="26" fill="#71717a">Share Movies</text>
    </svg>
  `

  const png = await sharp(Buffer.from(svg)).png().toBuffer()

  return new NextResponse(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
