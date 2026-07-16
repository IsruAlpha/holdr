'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronRight, Download } from 'lucide-react'
import { useAuth } from '@workos-inc/authkit-nextjs/components'

export default function CallToAction() {
    const { user } = useAuth()

    return (
        <section className="bg-background @container py-24">
            <div className="mx-auto max-w-2xl px-6">
                <div className="text-center">
                    <h2 className="text-balance font-serif text-4xl font-medium">Ready to Start Your Collection?</h2>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">Join movie enthusiasts who are building their personal watchlists and discovering new favorites.</p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Button
                            asChild
                            className="pr-1.5">
                            <a href={user ? "/dashboard" : "/sign-up"}>
                                <span>{user ? "Dashboard" : "Get Started (Free)"}</span>
                                <ChevronRight className="opacity-50" />
                            </a>
                        </Button>
                        <Button
                            variant="secondary"
                            asChild>
                            <a href="/app">
                                <Download className="h-4 w-4 mr-1.5" />
                                Download for Android
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
