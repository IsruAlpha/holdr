"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { Authenticated } from "convex/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Film, ArrowLeft, Plus, Check } from "lucide-react";
import { HoldrLogo } from "@/components/holdr-logo";

function ShareContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const result = useQuery(
    api.shareLinks.getMoviesByShareCode,
    code ? { code } : "skip"
  );

  if (!code) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold">Invalid Share Link</h1>
          <p className="text-muted-foreground mt-2">This share link is not valid.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go home
          </Link>
        </div>
      </div>
    );
  }

  if (result === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (result === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold">Share Link Not Found</h1>
          <p className="text-muted-foreground mt-2">This share link does not exist or has expired.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go home
          </Link>
        </div>
      </div>
    );
  }

  const { movies, userName, userEmail, profilePictureUrl } = result;
  const avatarUrl = profilePictureUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userEmail || userName)}&backgroundColor=18181b,27272a,3f3f46&textColor=ffffff`;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 w-full bg-background/75 border-b border-black/5 backdrop-blur-lg">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <HoldrLogo showText={false} className="!size-7 sm:!size-8" />
              <span className="text-lg sm:text-xl font-bold tracking-tight">Holdr</span>
            </Link>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Try Holdr
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
              <AvatarImage src={avatarUrl} alt={userName} />
              <AvatarFallback className="text-xs sm:text-sm">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-xl sm:text-2xl md:text-3xl tracking-tight">
              <span className="font-normal">{movies.length} movie{movies.length !== 1 ? "s" : ""} shared with you from </span>
              <span className="font-semibold">{userName}</span>
            </h1>
          </div>
        </div>

        {movies.length === 0 ? (
          <div className="text-center py-16">
            <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No movies shared yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {movies.map((movie) => (
              <ShareMovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ShareMovieCard({ movie }: { movie: { _id: string; title: string; year: string; poster: string; rating: string; genre: string; description: string; watched: boolean } }) {
  const addMovie = useMutation(api.movies.addMovie);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    setAdding(true);
    try {
      await addMovie({
        title: movie.title,
        year: movie.year,
        poster: movie.poster,
        rating: movie.rating,
        genre: movie.genre,
        description: movie.description,
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
        <Avatar className="h-24 w-16 sm:h-32 sm:w-24 rounded-lg shrink-0">
          <AvatarImage src={movie.poster} alt={movie.title} />
          <AvatarFallback className="rounded-lg bg-muted">
            <Film className="h-5 w-5 sm:h-6 sm:w-6" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold leading-tight">{movie.title}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{movie.year}</p>
          {movie.rating !== "N/A" && (
            <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
              <span className="text-xs sm:text-sm font-medium">{movie.rating}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">/10 IMDB</span>
            </div>
          )}
          {movie.genre && (
            <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
              {movie.genre.split(", ").map((g) => (
                <Badge key={g} variant="secondary" className="text-[10px] sm:text-xs">
                  {g}
                </Badge>
              ))}
            </div>
          )}
          {movie.description && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2 line-clamp-2">
              {movie.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between border-t bg-muted/30 px-3 py-2 sm:px-6 sm:py-3">
        <Badge
          variant={movie.watched ? "watched" : "toWatch"}
          className="text-[10px] sm:text-xs"
        >
          {movie.watched ? "Watched" : "To Watch"}
        </Badge>
        <Authenticated>
          {added ? (
            <Button size="sm" variant="outline" disabled className="gap-1 text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3">
              <Check className="h-3 w-3" />
              Added
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={handleAdd} disabled={adding} className="gap-1 text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3">
              <Plus className="h-3.5 w-3.5" />
              {adding ? "..." : "Add"}
            </Button>
          )}
        </Authenticated>
      </div>
    </div>
  );
}

export default function ShareClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <ShareContent />
    </Suspense>
  );
}
