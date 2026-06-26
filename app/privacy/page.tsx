import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy - Holdr',
  description: 'Privacy policy for the Holdr movie tracking platform.',
}

export default function PrivacyPage() {
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

        <h1 className="text-3xl font-bold tracking-tight mb-8">Privacy Policy</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-sm">Last updated: June 26, 2026</p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p>When you use Holdr, we collect information you provide directly, including your name, email address, and profile picture from your authentication provider (WorkOS). We also collect the movies you add to your watchlist and your sharing activity.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>We use your information to provide and improve the Holdr service, including displaying your watchlist, enabling sharing features, and showing recommendations from other users.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. Information Sharing</h2>
            <p>Your watchlist is private by default. When you share your watchlist via a share link, the movies in your list become visible to anyone with the link. Your name and profile picture are displayed alongside your shared list.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Data Storage</h2>
            <p>Your data is stored securely using Convex, a cloud database platform. We implement appropriate security measures to protect your personal information.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:israelfirew7@gmail.com" className="text-foreground underline">israelfirew7@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
