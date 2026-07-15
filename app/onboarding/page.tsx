'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { HoldrLogo } from '@/components/holdr-logo';
import { Button } from '@/components/ui/button';
import { ChevronRight, Film, Users, TrendingUp, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  {
    icon: Film,
    title: 'Track Every Movie',
    description: 'Save movies you want to watch and mark them as you go.',
    color: 'text-blue-500',
  },
  {
    icon: Users,
    title: 'Share With Friends',
    description: 'Create your watchlist and share it with anyone.',
    color: 'text-purple-500',
  },
  {
    icon: TrendingUp,
    title: 'Discover What\'s Trending',
    description: 'See what\'s popular in Ethiopia and around the world.',
    color: 'text-orange-500',
  },
  {
    icon: Star,
    title: 'Build Your Profile',
    description: 'Become a top watcher and climb the leaderboard.',
    color: 'text-yellow-500',
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const { user } = useAuth();

  const isLast = step === steps.length - 1;
  const currentStep = steps[step];

  function handleNext() {
    if (isLast) {
      router.push('/dashboard');
    } else {
      setStep(step + 1);
    }
  }

  function handleSkip() {
    router.push('/dashboard');
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="flex items-center justify-between px-6 pt-6">
        <HoldrLogo className="!size-8" showText={false} />
        {!isLast && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-muted-foreground text-sm"
          >
            Skip
          </Button>
        )}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-8 text-center"
          >
            <div className={`rounded-2xl bg-muted p-6 ${currentStep.color}`}>
              <currentStep.icon className="h-12 w-12" />
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {currentStep.title}
              </h1>
              <p className="text-muted-foreground text-base max-w-xs mx-auto">
                {currentStep.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-6 px-6 pb-12">
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-foreground' : 'w-1.5 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
        <Button
          onClick={handleNext}
          className="w-full max-w-sm h-12 text-base font-medium"
        >
          {isLast ? (
            <>
              {user ? 'Go to Dashboard' : 'Get Started'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
