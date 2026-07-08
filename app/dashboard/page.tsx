"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { MovieSearch } from "@/components/movie-search";
import { MovieDataTable, type Movie } from "@/components/movie-data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Film, Share2 } from "lucide-react";
import { HoldrLogo } from "@/components/holdr-logo";

export default function DashboardPage() {
  const { user, signOut } = useAuth();

  return (
    <>
      <Authenticated>
        {user && <DashboardHeader user={user} onSignOut={signOut} />}
        {user && <DashboardContent user={user} />}
      </Authenticated>
      <Unauthenticated>
        <RedirectToHome />
      </Unauthenticated>
    </>
  );
}

function RedirectToHome() {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  }, [router]);
  return null;
}

function DashboardHeader({
  user,
  onSignOut,
}: {
  user: { email: string; firstName?: string | null; lastName?: string | null; profilePictureUrl?: string | null };
  onSignOut: () => void;
}) {
  const avatarUrl = user.profilePictureUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.email)}&backgroundColor=18181b,27272a,3f3f46&textColor=ffffff`;

  return (
    <header className="fixed top-0 z-20 w-full bg-background/75 border-b border-black/5 backdrop-blur-lg">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-3 sm:py-4">
          <Link href="/" className="flex items-center gap-2">
            <HoldrLogo showText={false} className="!size-7 sm:!size-8" />
            <span className="text-lg sm:text-xl font-bold tracking-tight">Holdr</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
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

function DashboardContent({ user }: { user: { email: string; firstName?: string | null; lastName?: string | null; profilePictureUrl?: string | null } }) {
  const movies = useQuery(api.movies.listMovies);
  const sharedWatchlists = useQuery(api.shareLinks.listSharedWatchlists);
  const toggleWatched = useMutation(api.movies.toggleWatched);
  const removeMovie = useMutation(api.movies.removeMovie);
  const createShareLink = useMutation(api.shareLinks.createShareLink);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const displayName = user.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ``}`
    : user.email.split("@")[0];

  // Capture stable refs so the one-shot useEffect doesn't need them in deps
  const createShareLinkRef = useRef(createShareLink);
  createShareLinkRef.current = createShareLink;
  const syncPayloadRef = useRef({ displayName, email: user.email, pic: user.profilePictureUrl });
  syncPayloadRef.current = { displayName, email: user.email, pic: user.profilePictureUrl };

  // Silently upsert user info into shareLinks so they always have a real name
  // in other people's Recommendations — even before they click "Share Page".
  // Empty dep array = run exactly once after first mount, never re-runs.
  useEffect(() => {
    const { displayName: name, email, pic } = syncPayloadRef.current;
    createShareLinkRef.current({
      userName: name,
      userEmail: email,
      profilePictureUrl: pic || undefined,
    }).catch(() => {
      // Non-critical — ignore silently
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleWatched = (movieId: string) => {
    toggleWatched({ movieId: movieId as Id<"movies"> });
  };

  const handleRemoveMovie = (movieId: string) => {
    removeMovie({ movieId: movieId as Id<"movies"> });
  };

  const handleShare = async () => {
    try {
      const code = await createShareLink({
        userName: displayName,
        userEmail: user.email,
        profilePictureUrl: user.profilePictureUrl || undefined,
      });
      const url = `${window.location.origin}/share?code=${code}`;
      await navigator.clipboard.writeText(url);
      setToastMessage("Link copied!");
      setTimeout(() => setToastMessage(null), 2000);
    } catch {
      // Failed
    }
  };

  return (
    <main className="pt-16 sm:pt-20 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Watchlist</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Search for movies and build your collection.
          </p>
        </div>

        <div className="mb-6 sm:mb-8 flex items-center gap-3">
          <div className="flex-1">
            <MovieSearch user={user} />
          </div>
          <div className="relative shrink-0">
            <Button onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share Page
            </Button>

            {toastMessage && (
              <div className="absolute -bottom-10 right-0 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium shadow-lg whitespace-nowrap">
                  <Share2 className="h-3 w-3" />
                  {toastMessage}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          {movies === undefined ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Loading your watchlist...
            </div>
          ) : (
            <MovieDataTable
              movies={movies as Movie[]}
              onToggleWatched={handleToggleWatched}
              onRemoveMovie={handleRemoveMovie}
            />
          )}
        </div>

        {sharedWatchlists && sharedWatchlists.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Recommendations</h2>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Movies shared by others.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sharedWatchlists.map((watchlist) => {
                const watchlistAvatarUrl = watchlist.profilePictureUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(watchlist.userEmail || watchlist.userName)}&backgroundColor=18181b,27272a,3f3f46&textColor=ffffff`;

                return (
                  <Link
                    key={watchlist.userId}
                    href={`/share?userId=${encodeURIComponent(watchlist.userId)}`}
                    className="group relative rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-all aspect-[4/3]"
                  >
                    <div className="absolute inset-0 flex items-center justify-center gap-2 p-4">
                      {watchlist.movies.slice(0, 3).map((movie) => (
                        <div
                          key={movie._id}
                          className="relative rounded-lg overflow-hidden shrink-0 h-28 w-20 sm:h-36 sm:w-24 shadow-sm"
                        >
                          {movie.poster && movie.poster !== "N/A" ? (
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <Film className="h-5 w-5 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/80 to-transparent pt-12 pb-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 ring-2 ring-background shrink-0">
                          <AvatarImage src={watchlistAvatarUrl} alt={watchlist.userName} />
                          <AvatarFallback className="text-xs">
                            {watchlist.userName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold truncate">
                            {watchlist.userName}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {watchlist.movieCount} movie{watchlist.movieCount !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
