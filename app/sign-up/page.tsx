'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { HoldrLogo } from '@/components/holdr-logo';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isNative, setIsNative] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  async function handleSignUp() {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/auth/workos-url?type=sign-up&native=${isNative}`);
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

  async function handleSignIn() {
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/workos-url?type=sign-in&native=${isNative}`);
      const data = await res.json();
      if (data.url) {
        if (isNative) {
          await Browser.open({ url: data.url });
        } else {
          window.location.href = data.url;
        }
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background relative">
      {/* Back button */}
      <div className="absolute top-0 left-0 z-10 px-4 pt-4" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)' }}>
        <button
          onClick={() => router.push('/')}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-sm flex flex-col items-center gap-8"
        >
          {/* Logo */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 opacity-50 blur-xl scale-150" />
            <div className="relative bg-background rounded-2xl p-4">
              <HoldrLogo className="!size-12" showText={false} />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center space-y-3">
            <h1 className="text-[28px] font-bold tracking-tight">Create your account</h1>
            <p className="text-muted-foreground text-[15px] leading-relaxed">
              Start building your watchlist and share it with friends.
            </p>
          </div>

          {/* Sign up button */}
          <div className="w-full flex flex-col gap-3">
            <Button
              onClick={handleSignUp}
              disabled={loading}
              className="h-[52px] text-[15px] font-semibold rounded-xl w-full"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Continue with email
                </>
              )}
            </Button>
          </div>

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          {/* Sign in link */}
          <p className="text-muted-foreground text-sm">
            Already have an account?{' '}
            <button
              onClick={handleSignIn}
              className="text-foreground font-medium hover:underline transition-all"
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
