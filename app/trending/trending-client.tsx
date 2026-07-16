"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { Authenticated } from "convex/react";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Film, ArrowLeft, Plus, Check, TrendingUp, Loader2, ListFilter } from "lucide-react";
import { HoldrLogo } from "@/components/holdr-logo";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TrendingMovie {
  rank: number;
  title: string;
  release_year: number;
  poster: string;
  mean_rating: number;
  content_type: string;
  plot: string;
}

interface TrendingResponse {
  updated_at: string;
  results: TrendingMovie[];
}

function useTrending() {
  const [data, setData] = useState<TrendingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchTrending() {
      try {
        const res = await fetch("/api/trending");
        if (!res.ok) throw new Error("Failed to load");
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load trending movies. Try again later.");
          setLoading(false);
        }
      }
    }
    fetchTrending();
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}

function TrendingHeader() {
  return (
    <header className="sticky top-0 z-20 w-full bg-background/75 border-b border-black/5 backdrop-blur-lg">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <HoldrLogo showText={false} className="!size-7 sm:!size-8" />
            <span className="text-lg sm:text-xl font-bold tracking-tight">Holdr</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function TrendingCard({ movie }: { movie: TrendingMovie }) {
  const { user } = useAuth();
  const addMovie = useMutation(api.movies.addMovie);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    setAdding(true);
    try {
      await addMovie({
        title: movie.title,
        year: String(movie.release_year),
        poster: movie.poster,
        rating: movie.mean_rating ? String(movie.mean_rating) : "N/A",
        genre: movie.content_type,
        description: movie.plot || "",
        userName: user ? (user.firstName || user.email?.split("@")[0]) : undefined,
        userEmail: user?.email,
        profilePictureUrl: user?.profilePictureUrl || undefined,
      });
      setAdded(true);
    } catch {
      // Failed
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex gap-3 p-3 sm:gap-6 sm:p-6">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-24 w-16 sm:h-36 sm:w-24 rounded-lg object-cover shrink-0"
            loading="lazy"
          />
        ) : (
          <div className="h-24 w-16 sm:h-36 sm:w-24 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <Film className="h-6 w-6 text-muted-foreground/50" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <span className="text-xs font-mono text-muted-foreground mt-0.5 shrink-0">
              #{movie.rank}
            </span>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold leading-tight">{movie.title}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{movie.release_year}</p>
            </div>
          </div>
          {movie.mean_rating > 0 && (
            <div className="flex items-center gap-1 mt-1.5 sm:mt-2 ml-6">
              <span className="text-xs sm:text-sm font-medium">{movie.mean_rating.toFixed(1)}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">/10</span>
            </div>
          )}
          {movie.content_type && (
            <div className="mt-1.5 sm:mt-2 ml-6">
              <Badge variant="secondary" className="text-[10px] sm:text-xs capitalize">
                {movie.content_type}
              </Badge>
            </div>
          )}
          {movie.plot && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2 line-clamp-2 ml-6">
              {movie.plot}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end border-t bg-muted/30 px-3 py-2 sm:px-6 sm:py-3">
        <Authenticated>
          {added ? (
            <Button size="sm" variant="outline" disabled className="gap-1 text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3">
              <Check className="h-3 w-3" />
              Added to Watchlist
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={handleAdd} disabled={adding} className="gap-1 text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3">
              <Plus className="h-3.5 w-3.5" />
              {adding ? "..." : "Add to Watchlist"}
            </Button>
          )}
        </Authenticated>
      </div>
    </div>
  );
}

export default function TrendingClient() {
  const { data, loading, error } = useTrending();
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredResults = (data?.results ?? [])
    .filter((movie) => {
      if (typeFilter === "all") return true;
      return movie.content_type?.toLowerCase() === typeFilter;
    })
    .sort((a, b) => a.rank - b.rank);

  return (
    <div className="min-h-screen bg-background">
      <TrendingHeader />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-12">
        <div className="mb-6 sm:mb-10">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Trending in Ethiopia
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
            The most watched movies and shows right now, powered by T4TSA. Add any title directly to your Holdr watchlist.
          </p>
          {data?.updated_at && (
            <p className="text-xs text-muted-foreground/60 mt-2">
              Last updated: {new Date(data.updated_at).toLocaleString()}
            </p>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading trending titles...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-24">
            <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        )}

        {data?.results && data.results.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 text-xs sm:text-sm">
                    <ListFilter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>{typeFilter === "all" ? "All" : typeFilter === "movie" ? "Movies" : "Series"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={typeFilter === "all"}
                    onCheckedChange={() => setTypeFilter("all")}
                  >
                    All
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={typeFilter === "movie"}
                    onCheckedChange={() => setTypeFilter("movie")}
                  >
                    Movies
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={typeFilter === "series"}
                    onCheckedChange={() => setTypeFilter("series")}
                  >
                    Series
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <span className="text-xs text-muted-foreground">
                {filteredResults.length} title{filteredResults.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid gap-4 sm:gap-5">
              {filteredResults.map((movie) => (
                <TrendingCard key={movie.rank} movie={movie} />
              ))}
            </div>

            {filteredResults.length === 0 && (
              <div className="text-center py-16">
                <Film className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No {typeFilter === "movie" ? "movies" : "series"} in the trending list.</p>
              </div>
            )}
          </>
        )}

        {data?.results && data.results.length === 0 && !loading && (
          <div className="text-center py-24">
            <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No trending data available right now.</p>
          </div>
        )}
      </main>
    </div>
  );
}
