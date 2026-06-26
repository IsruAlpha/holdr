import { HeroHeader } from '@/components/header'
import { Search, Film, Share2, UserPlus, Bookmark, Lightbulb, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function UsecasePage() {
    return (
        <>
            <HeroHeader />
            <main className="pt-32 pb-20">
                <section className="bg-background">
                    <div className="mx-auto max-w-3xl px-6">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Link>
                        <h1 className="text-balance font-serif text-4xl font-medium sm:text-5xl text-center">
                            How Holdr Works
                        </h1>
                        <p className="text-muted-foreground mt-6 text-center text-balance max-w-xl mx-auto">
                            Create your account, build your watchlist with real movie posters and ratings, and share it with friends.
                        </p>

                        <div id="how-it-works" className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6">
                            {[
                                { icon: UserPlus, name: 'Create Account', description: 'Sign up in seconds with your email or Google account.' },
                                { icon: Search, name: 'Search Movies', description: 'Find any movie with real posters, ratings, and descriptions.' },
                                { icon: Bookmark, name: 'Build Watchlist', description: 'Save movies you want to watch and track what you have seen.' },
                                { icon: Share2, name: 'Share Lists', description: 'Generate a share link so friends can see your movie picks.' },
                                { icon: Lightbulb, name: 'Get Recommendations', description: 'Discover new films from what other users are watching.' },
                                { icon: Film, name: 'Track Progress', description: 'Mark movies as watched and keep your collection organized.' },
                            ].map((feature) => (
                                <div
                                    key={feature.name}
                                    className="bg-muted/50 rounded-xl p-6 space-y-3">
                                    <feature.icon className="size-8 text-foreground" />
                                    <h3 className="font-medium">{feature.name}</h3>
                                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16">
                            <h2 className="font-serif text-2xl font-medium text-center">Getting Started</h2>
                            <div className="mt-8 space-y-8 max-w-lg mx-auto">
                                {[
                                    { step: '1', title: 'Create Your Account', description: 'Sign up for free. No credit card required.' },
                                    { step: '2', title: 'Search & Add Movies', description: 'Use the search bar to find movies by title. Real posters, ratings, and genres load automatically.' },
                                    { step: '3', title: 'Share With Friends', description: 'Click "Share Page" to get a link. Send it to anyone — they do not need an account to view your list.' },
                                ].map((item) => (
                                    <div key={item.step} className="flex gap-4 items-start">
                                        <div className="bg-foreground text-background size-8 rounded-full flex items-center justify-center shrink-0 font-medium text-sm">
                                            {item.step}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium">{item.title}</h3>
                                            <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
