import type { Metadata } from 'next'
import ShareClient from './share-client'

// Always run at request time so every share link gets its own personalized OG
export const dynamic = 'force-dynamic'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getShareData(code: string) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
  if (!convexUrl) return null

  try {
    const response = await fetch(`${convexUrl}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        path: 'shareLinks:getMoviesByShareCode',
        args: { code },
      }),
    })

    if (!response.ok) return null
    const data = await response.json()
    return data.value
  } catch {
    return null
  }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const code = typeof params.code === 'string' ? params.code : ''
  const userId = typeof params.userId === 'string' ? params.userId : ''

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://holdr.linkroot.space'
  const identifier = code || userId

  let description = 'Check out this movie watchlist shared on Holdr.'

  if (code) {
    const shareData = await getShareData(code)
    const resolvedName = shareData?.userName?.trim() ||
      (shareData?.userEmail
        ? shareData.userEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
        : null)
    if (resolvedName) {
      description = `Check out ${resolvedName}'s movie recommendations on Holdr.`
    }
  }

  return {
    title: 'Shared Watchlist - Holdr',
    description,
    openGraph: {
      title: 'Shared Watchlist - Holdr',
      description,
      images: [
        {
          url: `${baseUrl}/api/og/share/${identifier}`,
          width: 1200,
          height: 630,
          alt: 'Holdr Shared Watchlist',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Shared Watchlist - Holdr',
      description,
      images: [`${baseUrl}/api/og/share/${identifier}`],
    },
  }
}

export default function SharePage({ searchParams }: Props) {
  return <ShareClient />
}
