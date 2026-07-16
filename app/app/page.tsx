"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HoldrLogo } from "@/components/holdr-logo";
import { Button } from "@/components/ui/button";
import {
  PhoneCarousel,
  type ImageItem,
} from "@/registry/components/phone-mockups/one/phone-carousel";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";

function Screen1() {
  return (
    <div className="w-full h-full bg-[#faf8f5] flex flex-col items-center justify-between py-12 px-6 text-center">
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <img src="/illustrations/track-movies.svg" alt="Track" className="w-48 h-48 object-contain" />
        <div>
          <h2 className="text-[22px] font-bold tracking-tight text-black mb-2" style={{ fontFamily: "monospace" }}>Track Every Movie</h2>
          <p className="text-[11px] leading-relaxed text-gray-500 max-w-[240px] mx-auto" style={{ fontFamily: "monospace" }}>
            Save films you want to watch, rate the ones you&apos;ve seen, and never lose track of what to watch next.
          </p>
        </div>
      </div>
      <div className="w-full flex flex-col items-center gap-4">
        <div className="flex gap-1.5">
          <div className="w-6 h-1.5 rounded-full bg-purple-500" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
        </div>
        <div className="w-full h-11 rounded-full bg-purple-500 flex items-center justify-center text-white text-[13px] font-semibold gap-1" style={{ fontFamily: "monospace" }}>
          Continue <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}

function Screen2() {
  return (
    <div className="w-full h-full bg-[#f0f4ff] flex flex-col items-center justify-between py-12 px-6 text-center">
      <div className="absolute top-4 right-4 text-[10px] text-gray-400" style={{ fontFamily: "monospace" }}>Skip</div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <img src="/illustrations/share-friends.svg" alt="Share" className="w-48 h-48 object-contain" />
        <div>
          <h2 className="text-[22px] font-bold tracking-tight text-black mb-2" style={{ fontFamily: "monospace" }}>Share With Friends</h2>
          <p className="text-[11px] leading-relaxed text-gray-500 max-w-[240px] mx-auto" style={{ fontFamily: "monospace" }}>
            Create your personal watchlist and share it with anyone. See what your friends are watching and recommend films.
          </p>
        </div>
      </div>
      <div className="w-full flex flex-col items-center gap-4">
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <div className="w-6 h-1.5 rounded-full bg-blue-500" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
        </div>
        <div className="w-full h-11 rounded-full bg-blue-500 flex items-center justify-center text-white text-[13px] font-semibold gap-1" style={{ fontFamily: "monospace" }}>
          Continue <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}

function Screen3() {
  return (
    <div className="w-full h-full bg-[#fafafa] flex flex-col items-center justify-between py-12 px-6 text-center">
      <div className="absolute top-4 right-4 text-[10px] text-gray-400" style={{ fontFamily: "monospace" }}>Skip</div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <img src="/illustrations/discover-trending.svg" alt="Discover" className="w-48 h-48 object-contain" />
        <div>
          <h2 className="text-[22px] font-bold tracking-tight text-black mb-2" style={{ fontFamily: "monospace" }}>Discover What&apos;s Trending</h2>
          <p className="text-[11px] leading-relaxed text-gray-500 max-w-[240px] mx-auto" style={{ fontFamily: "monospace" }}>
            See what&apos;s popular in Ethiopia and around the world. Find your next favorite film from what people are watching.
          </p>
        </div>
      </div>
      <div className="w-full flex flex-col items-center gap-4">
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <div className="w-6 h-1.5 rounded-full bg-amber-500" />
        </div>
        <div className="w-full h-11 rounded-full bg-black flex items-center justify-center text-white text-[13px] font-semibold gap-1" style={{ fontFamily: "monospace" }}>
          Get Started <ArrowRight className="w-3.5 h-3.5" />
        </div>
        <p className="text-[10px] text-gray-400" style={{ fontFamily: "monospace" }}>
          Already have an account? <span className="text-black font-medium">Sign in</span>
        </p>
      </div>
    </div>
  );
}

const appScreens: ImageItem[] = [
  {
    src: "/illustrations/track-movies.svg",
    alt: "Track Every Movie",
    children: <Screen1 />,
  },
  {
    src: "/illustrations/share-friends.svg",
    alt: "Share With Friends",
    children: <Screen2 />,
  },
  {
    src: "/illustrations/discover-trending.svg",
    alt: "Discover What's Trending",
    children: <Screen3 />,
  },
];

export default function AppPage() {
  const [apkUrl, setApkUrl] = useState("");

  useEffect(() => {
    setApkUrl("/holdr1.0.1.apk");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 w-full bg-background/75 border-b border-black/5 backdrop-blur-lg">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <HoldrLogo showText={false} className="!size-7" />
              <span className="text-lg font-bold tracking-tight">Holdr</span>
            </Link>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to site
            </Link>
          </div>
        </div>
      </header>

      <main>
        <PhoneCarousel images={appScreens} />

        <div className="flex flex-col items-center gap-4 pb-20 pt-16 px-4">
          <Button size="lg" className="gap-2 h-14 px-10 text-base font-semibold" asChild>
            <a href={apkUrl} download="holdr.apk">
              <Download className="h-5 w-5" />
              Download for Android
            </a>
          </Button>
          <p className="text-sm text-muted-foreground">
            Free to use. No ads.
          </p>
        </div>
      </main>
    </div>
  );
}
