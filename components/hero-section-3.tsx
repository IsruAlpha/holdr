import React from 'react'
import { Button } from '@/components/ui/button'
import { HeroHeader } from './header'
import { ChevronRight, Film, Star, Bookmark, Share2 } from 'lucide-react'
import { KineticTextReveal } from '@/components/ui/kinetic-text-reveal'

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <section className="bg-background">
                    <div className="relative py-40">
                        <div className="relative z-10 mx-auto w-full max-w-5xl sm:pl-6">
                            <div className="flex items-center justify-between max-md:flex-col">
                                <div className="max-w-md max-sm:px-6">
                                    <KineticTextReveal
                                        text="Good Movie Taste Comes From Unemployment"
                                        className="text-balance font-serif text-4xl font-medium sm:text-5xl"
                                    />
                                    <p className="text-muted-foreground mt-4 text-balance">Holdr helps you store movies you want to watch later and discover new favorites through friends&apos; recommendations.</p>

                                    <Button
                                        asChild
                                        className="mt-6 pr-1.5">
                                        <a href="/sign-up">
                                            <span className="text-nowrap">Start Collecting</span>
                                            <ChevronRight className="opacity-50" />
                                        </a>
                                    </Button>
                                </div>
                                <div
                                    aria-hidden
                                    className="mask-y-from-50% relative max-md:mx-auto max-md:*:scale-90">
                                    {[
                                        'Inception - Christopher Nolan',
                                        'The Shawshank Redemption',
                                        'Pulp Fiction - Quentin Tarantino',
                                        'The Dark Knight Trilogy',
                                        'Interstellar - Space Epic',
                                        'Parasite - Award Winner',
                                        'The Godfather - Classic',
                                        'Fight Club - Must Watch',
                                        'Forrest Gump - Timeless',
                                        'The Matrix - Sci-Fi Masterpiece',
                                    ].map((prompt, index) => (
                                        <div
                                            key={index}
                                            className="text-muted-foreground flex items-center gap-2 px-14 py-2 text-sm">
                                            <Film className="size-3.5 opacity-50" />
                                            <span className="text-nowrap">{prompt}</span>
                                        </div>
                                    ))}
                                    <div className="bg-card min-w-sm ring-border shadow-foreground/6.5 dark:shadow-black/6.5 absolute inset-0 m-auto mt-auto flex h-fit justify-between gap-3 rounded-full p-2 shadow-xl ring-1 sm:inset-2">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-muted flex size-9 cursor-pointer rounded-full *:m-auto *:size-4">
                                                <Bookmark />
                                            </div>
                                            <div className="text-muted-foreground text-sm">Add to watchlist...</div>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            <div className="hover:bg-muted flex size-9 cursor-pointer rounded-full *:m-auto *:size-4">
                                                <Star />
                                            </div>
                                            <div className="bg-foreground text-background flex size-9 cursor-pointer rounded-full *:m-auto *:size-4 hover:brightness-110">
                                                <Share2 />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
