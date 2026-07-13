'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, ArrowRight, X } from 'lucide-react'

export function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="relative w-full bg-foreground text-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-2.5 sm:py-3 gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Clock className="h-3.5 w-3.5 shrink-0 opacity-70" />
            <p className="text-[11px] sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              Trending movies &amp; series in Ethiopia now on Holdr
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/trending"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium hover:underline"
            >
              Trending
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={() => setDismissed(true)}
              className="ml-1 p-1 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
