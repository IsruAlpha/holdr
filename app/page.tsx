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
import { MetalFx } from 'metal-fx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Home() {
  return (
    <>
      <Authenticated>
        <NativeRedirect />
        <WebLanding />
      </Authenticated>
      <Unauthenticated>
        <NativeRedirectOnboarding />
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

function NativeRedirectOnboarding() {
  const router = useRouter();
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      setIsNative(true);
      router.replace('/onboarding');
    }
  }, [router]);

  if (!isNative) return null;
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="animate-spin h-6 w-6 border-2 border-muted-foreground border-t-transparent rounded-full" />
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
  const displayName = user.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ``}`
    : user.email.split("@")[0];

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
            {/* Desktop */}
            <div className="hidden sm:flex items-center gap-3">
              <MetalFx preset="chromatic" strength={0.6}>
                <Avatar className="h-8 w-8 ring-2 ring-background">
                  <AvatarImage src={avatarUrl} alt={user.email} />
                  <AvatarFallback className="text-xs">
                    {user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </MetalFx>
              <Button variant="ghost" size="sm" onClick={onSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </Button>
            </div>
            {/* Mobile */}
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none">
                    <MetalFx preset="chromatic" strength={0.6}>
                      <Avatar className="h-8 w-8 ring-2 ring-background">
                        <AvatarImage src={avatarUrl} alt={user.email} />
                        <AvatarFallback className="text-xs">
                          {user.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </MetalFx>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium truncate">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuItem
                    onClick={onSignOut}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
