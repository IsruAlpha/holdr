'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { HoldrLogo } from '@/components/holdr-logo';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NATIVE_REDIRECT = 'space.linkroot.holdr://auth-callback';

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isNative, setIsNative] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  async function handleSignIn() {
    setLoading(true);
    setError('');

    try {
      const type = 'sign-in';
      const res = await fetch(`/api/auth/workos-url?type=${type}&native=${isNative}`);
      const data = await res.json();

      if (!data.url) {
        setError('Failed to start sign-in');
        setLoading(false);
        return;
      }

      if (isNative) {
        await Browser.open({ url: data.url });
      } else {
        window.location.href = data.url;
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  async function handleSignUp() {
    setLoading(true);
    setError('');

    try {
      const type = 'sign-up';
      const res = await fetch(`/api/auth/workos-url?type=${type}&native=${isNative}`);
      const data = await res.json();

      if (!data.url) {
        setError('Failed to start sign-up');
        setLoading(false);
        return;
      }

      if (isNative) {
        await Browser.open({ url: data.url });
      } else {
        window.location.href = data.url;
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm flex flex-col items-center gap-8"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          >
            <HoldrLogo className="!size-14" showText={false} />
          </motion.div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Welcome to Holdr</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Sign in to track movies, share lists with friends, and discover what to watch next.
            </p>
          </div>

          <div className="w-full flex flex-col gap-3">
            <Button
              onClick={handleSignIn}
              disabled={loading}
              className="h-12 text-base font-medium w-full"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Sign in'
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={handleSignUp}
              disabled={loading}
              className="h-12 text-base font-medium w-full"
            >
              Create account
            </Button>
          </div>

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}
        </motion.div>
      </div>

      <div className="pb-8 pt-4 text-center">
        <button
          onClick={() => router.push('/')}
          className="text-muted-foreground hover:text-foreground text-sm inline-flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>
      </div>
    </div>
  );
}
