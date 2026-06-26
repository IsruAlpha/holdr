import type { Metadata } from 'next'
import ShareClient from './share-client'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const code = typeof params.code === 'string' ? params.code : ''

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://holdr.linkroot.space'

  return {
    title: 'Shared Watchlist - Holdr',
    description: 'Check out this movie watchlist shared on Holdr.',
    openGraph: {
      title: 'Shared Watchlist - Holdr',
      description: 'Check out this movie watchlist shared on Holdr.',
      images: [
        {
          url: `${baseUrl}/api/og/share/${code}`,
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
      description: 'Check out this movie watchlist shared on Holdr.',
      images: [`${baseUrl}/api/og/share/${code}`],
    },
  }
}

export default function SharePage({ searchParams }: Props) {
  return <ShareClient />
}
