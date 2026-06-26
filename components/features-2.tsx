import { Card } from '@/components/ui/card'
import { Bookmark, Film, Users, Star, Clock } from 'lucide-react'

export default function Features() {
    return (
        <section id="features" className="bg-background @container py-24">
            <div className="mx-auto max-w-2xl px-6">
                <div>
                    <h2 className="text-balance font-serif text-4xl font-medium">Everything You Need to Track Movies</h2>
                    <p className="text-muted-foreground mt-4 text-balance">Build your watchlist, get personalized recommendations, and share your favorite films with friends.</p>
                </div>
                <div className="@xl:grid-cols-2 mt-12 grid gap-3 *:p-6">
                    <Card
                        variant="mixed"
                        className="row-span-2 grid grid-rows-subgrid">
                        <div className="space-y-2">
                            <h3 className="text-foreground font-medium">Watchlist Management</h3>
                            <p className="text-muted-foreground text-sm">Save movies you want to watch later and organize them by genre, mood, or priority.</p>
                        </div>
                        <div
                            aria-hidden
                            className="flex h-44 flex-col justify-center gap-3 pt-4">
                            {[
                                { icon: Film, label: 'Sci-Fi Collection', count: '24 movies' },
                                { icon: Star, label: 'Top Rated', count: '18 movies' },
                                { icon: Clock, label: 'Watch Later', count: '12 movies' },
                            ].map((item, i) => (
                                <div key={i} className="bg-muted/50 flex items-center gap-3 rounded-lg px-4 py-3">
                                    <item.icon className="text-muted-foreground size-5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{item.label}</p>
                                        <p className="text-xs text-muted-foreground">{item.count}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card
                        variant="mixed"
                        className="row-span-2 grid grid-rows-subgrid overflow-hidden">
                        <div className="space-y-2">
                            <h3 className="text-foreground font-medium">Friend Recommendations</h3>
                            <p className="text-muted-foreground text-sm">See what your friends are watching and get personalized movie suggestions.</p>
                        </div>
                        <div
                            aria-hidden
                            className="relative h-44 translate-y-6">
                            <div className="bg-foreground/15 absolute inset-0 mx-auto w-px"></div>
                            <div className="absolute -inset-x-16 top-6 aspect-square rounded-full border"></div>
                            <div className="border-primary mask-l-from-50% mask-l-to-90% mask-r-from-50% mask-r-to-50% absolute -inset-x-16 top-6 aspect-square rounded-full border"></div>
                            <div className="absolute -inset-x-8 top-24 aspect-square rounded-full border"></div>
                            <div className="mask-r-from-50% mask-r-to-90% mask-l-from-50% mask-l-to-50% absolute -inset-x-8 top-24 aspect-square rounded-full border border-lime-500"></div>
                        </div>
                    </Card>
                    <Card
                        variant="mixed"
                        className="row-span-2 grid grid-rows-subgrid overflow-hidden">
                        <div className="space-y-2">
                            <h3 className="text-foreground font-medium">Social Sharing</h3>
                            <p className="text-muted-foreground mt-2 text-sm">Share your movie lists and reviews with friends and the community.</p>
                        </div>
                        <div
                            aria-hidden
                            className="flex h-44 items-center justify-center pt-4">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className="bg-muted border-background flex size-12 items-center justify-center rounded-full border-2">
                                        <Users className="text-muted-foreground size-5" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                    <Card
                        variant="mixed"
                        className="row-span-2 grid grid-rows-subgrid">
                        <div className="space-y-2">
                            <h3 className="font-medium">Quick Save</h3>
                            <p className="text-muted-foreground text-sm">Instantly save any movie with one click and add it to your collection.</p>
                        </div>

                        <div className="pointer-events-none relative flex size-44 items-center justify-center pt-5">
                            <Bookmark className="absolute inset-0 top-2.5 size-full stroke-[0.1px] opacity-15" />
                            <Bookmark className="size-32 stroke-[0.1px]" />
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    )
}
