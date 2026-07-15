'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { HoldrLogo } from '@/components/holdr-logo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const steps = [
  {
    image: '/illustrations/track-movies.svg',
    title: 'Track Every Movie',
    description: 'Save films you want to watch, rate the ones you\'ve seen, and never lose track of what to watch next.',
    gradient: 'from-violet-100 via-pink-50 to-orange-100',
    accent: '#8b5cf6',
  },
  {
    image: '/illustrations/share-friends.svg',
    title: 'Share With Friends',
    description: 'Create your personal watchlist and share it with anyone. See what your friends are watching and recommend films.',
    gradient: 'from-sky-100 via-blue-50 to-indigo-100',
    accent: '#3b82f6',
  },
  {
    image: '/illustrations/discover-trending.svg',
    title: 'Discover What\'s Trending',
    description: 'See what\'s popular in Ethiopia and around the world. Find your next favorite film from what people are watching.',
    gradient: 'from-amber-100 via-yellow-50 to-orange-100',
    accent: '#f59e0b',
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [isNative, setIsNative] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  const current = steps[step];
  const isLast = step === steps.length - 1;

  function handleNext() {
    if (isLast) {
      router.push(user ? '/dashboard' : '/sign-in');
    } else {
      setStep(step + 1);
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  function handleSkip() {
    router.push(user ? '/dashboard' : '/sign-in');
  }

  function handleAction() {
    if (isLast) {
      router.push(user ? '/dashboard' : '/sign-in');
    } else {
      router.push('/sign-in');
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background relative overflow-hidden">
      {/* Skip button */}
      {!isLast && (
        <div className="absolute top-0 right-0 z-10 px-4 pt-4" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)' }}>
          <button
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors px-2 py-1"
          >
            Skip
          </button>
        </div>
      )}

      {/* Back button */}
      {step > 0 && (
        <div className="absolute top-0 left-0 z-10 px-4 pt-4" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)' }}>
          <button
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Illustration area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-10 w-full max-w-sm"
          >
            {/* Illustration with gradient circle */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              {/* Background gradient circle */}
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${current.gradient} opacity-60 blur-xl scale-110`}
              />
              <div
                className={`absolute inset-4 rounded-full bg-gradient-to-br ${current.gradient} opacity-40`}
              />
              {/* Illustration */}
              <div className="relative z-10 w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center">
                <Image
                  src={current.image}
                  alt={current.title}
                  width={240}
                  height={240}
                  className="w-full h-full object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </div>

            {/* Text content */}
            <div className="text-center space-y-4 px-2">
              <h1 className="text-[28px] sm:text-3xl font-bold tracking-tight leading-tight">
                {current.title}
              </h1>
              <p className="text-muted-foreground text-[15px] leading-relaxed max-w-[320px] mx-auto">
                {current.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col items-center gap-6 px-6 pb-10 pt-4">
        {/* Progress dots */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === step ? 24 : 8,
                backgroundColor: i === step ? current.accent : 'oklch(0.87 0 0)',
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-2 rounded-full"
            />
          ))}
        </div>

        {/* CTA Button */}
        <Button
          onClick={isLast ? handleAction : handleNext}
          className="w-full max-w-sm h-[52px] text-[15px] font-semibold rounded-xl"
          style={!isLast ? { backgroundColor: current.accent } : undefined}
        >
          {isLast ? (
            <>
              {user ? 'Go to Dashboard' : 'Get Started'}
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </>
          )}
        </Button>

        {/* Bottom link */}
        <p className="text-muted-foreground text-sm">
          {isLast ? (
            <>
              Already have an account?{' '}
              <button
                onClick={() => router.push('/sign-in')}
                className="text-foreground font-medium hover:underline transition-all"
              >
                Sign in
              </button>
            </>
          ) : (
            <span className="opacity-0">spacer</span>
          )}
        </p>
      </div>
    </div>
  );
}
