import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service - Holdr',
  description: 'Terms of service for the Holdr movie tracking platform.',
}

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <h1 className="text-3xl font-bold tracking-tight mb-8">Terms of Service</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-sm">Last updated: June 26, 2026</p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing or using Holdr, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. Use of the Service</h2>
            <p>Holdr allows you to create movie watchlists, share them with others, and discover movies through other users&apos; recommendations. You are responsible for maintaining the confidentiality of your account.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. User Content</h2>
            <p>You retain ownership of the watchlists and content you create on Holdr. By sharing your watchlist, you grant other users the ability to view your shared movies.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Prohibited Conduct</h2>
            <p>You agree not to misuse the service, attempt to access other users&apos; private data, or use the service for any unlawful purpose.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Contact</h2>
            <p>For questions about these Terms, contact us at <a href="mailto:israelfirew7@gmail.com" className="text-foreground underline">israelfirew7@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
