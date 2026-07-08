import type { Metadata } from 'next';
import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ConvexClientProvider } from '@/components/ConvexClientProvider';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://holdr.linkroot.space';

export const metadata: Metadata = {
  title: 'Holdr - Store movies you want to watch later and discover new favorites through friends recommendations.',
  description: 'Store movies you want to watch later and get personalized recommendations from friends. The social movie tracking platform.',
  icons: {
    icon: '/holdr-logo.svg',
  },
  openGraph: {
    title: 'Holdr - Share Movies',
    description: 'Store movies you want to watch later and get personalized recommendations from friends.',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Holdr - Share Movies',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Holdr - Share Movies',
    description: 'Store movies you want to watch later and get personalized recommendations from friends.',
    images: [`${siteUrl}/og-image.png`],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { accessToken } = await withAuth();
  return (
    <html lang="en" className={cn("font-mono", jetbrainsMono.variable)}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <ConvexClientProvider expectAuth={!!accessToken}>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
