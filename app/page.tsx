'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { Authenticated, Unauthenticated } from 'convex/react';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import type { User } from '@workos-inc/node';
import Link from 'next/link';
import HeroSection from '@/components/hero-section-3';
import Features from '@/components/features-2';
import Integrations from '@/components/integrations-1';
import Content from '@/components/content-1';
import CallToAction from '@/components/call-to-action-1';
import Footer from '@/components/footer-3';
import { HoldrLogo } from '@/components/holdr-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <>
      <Authenticated>
        <NativeRedirect />
        <WebLanding />
      </Authenticated>
      <Unauthenticated>
        <NativeWelcome />
        <WebLanding />
      </Unauthenticated>
    </>
  );
}

function NativeRedirect() {
  const router = useRouter();
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      setIsNative(true);
      router.replace('/dashboard');
    }
  }, [router]);

  if (!isNative) return null;
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="animate-spin h-6 w-6 border-2 border-muted-foreground border-t-transparent rounded-full" />
    </div>
  );
}

function NativeWelcome() {
  const router = useRouter();
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  if (!isNative) return null;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-8 text-center max-w-sm"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          >
            <HoldrLogo className="!size-16" showText={false} />
          </motion.div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">Holdr</h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Your personal movie tracker. Save films, share lists with friends, and discover what to watch next.
            </p>
          </div>

          <div className="w-full flex flex-col gap-3 mt-2">
            <Button
              onClick={() => router.push('/sign-in')}
              className="h-12 text-base font-medium w-full"
            >
              Sign in
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push('/sign-up')}
              className="h-12 text-base font-medium w-full"
            >
              Create account
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function WebLanding() {
  const [isNative, setIsNative] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  if (isNative) return null;

  return (
    <>
      <Authenticated>
        {user && <LoggedInHeader user={user} onSignOut={signOut} />}
      </Authenticated>
      <Unauthenticated>
        <HeroSection />
      </Unauthenticated>
      <Features />
      <Integrations />
      <Content />
      <CallToAction />
      <Footer />
    </>
  );
}

function LoggedInHeader({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  const avatarUrl = user.profilePictureUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.email)}&backgroundColor=18181b,27272a,3f3f46&textColor=ffffff`;

  return (
    <header className="fixed top-0 z-20 w-full bg-background/75 border-b border-black/5 backdrop-blur-lg">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-4 sm:py-6">
          <Link href="/" className="flex items-center gap-2">
            <HoldrLogo showText={false} className="!size-7 sm:!size-8" />
            <span className="text-lg sm:text-xl font-bold tracking-tight">Holdr</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Avatar className="h-8 w-8 ring-2 ring-background">
              <AvatarImage src={avatarUrl} alt={user.email} />
              <AvatarFallback className="text-xs">
                {user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={onSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
