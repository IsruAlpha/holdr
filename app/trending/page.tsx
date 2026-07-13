import type { Metadata } from 'next'
import TrendingClient from './trending-client'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Trending in Ethiopia - Holdr',
  description: 'See what movies and shows are trending in Ethiopia right now. Add any title to your Holdr watchlist.',
}

export default function TrendingPage() {
  return <TrendingClient />
}
