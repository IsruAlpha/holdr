import Link from 'next/link'
import { HoldrLogo } from '@/components/holdr-logo'

const links = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '#features' },
    { label: 'Usecase', href: '#usecase' },
]

export default function Footer() {
    return (
        <footer className="bg-background @container py-12">
            <div className="mx-auto max-w-2xl px-6">
                <div className="border-y py-8">
                    <div className="@xl:flex-row @xl:items-center flex flex-col gap-6">
                        <Link
                            href="/"
                            aria-label="home">
                            <HoldrLogo className="h-5 w-fit" showText={true} />
                        </Link>
                        <nav className="@xl:ml-auto flex flex-wrap gap-x-6 gap-y-2">
                            {links.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
                <div className="pt-8 flex flex-col items-center gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
                        <p className="text-muted-foreground text-sm">&copy; {2026} Holdr. All rights reserved.</p>
                        <div className="flex gap-4">
                            <Link href="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Privacy</Link>
                            <Link href="/policy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Policy</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
