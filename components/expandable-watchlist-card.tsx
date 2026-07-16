"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Film, X } from "lucide-react";

interface WatchlistMovie {
  _id: string;
  title: string;
  poster: string;
}

interface ExpandableWatchlistCardProps {
  userId: string;
  userName: string;
  userEmail: string;
  profilePictureUrl?: string | null;
  movieCount: number;
  movies: WatchlistMovie[];
}

export function ExpandableWatchlistCard({
  userId,
  userName,
  userEmail,
  profilePictureUrl,
  movieCount,
  movies,
}: ExpandableWatchlistCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const layoutId = `watchlist-card-${userId}`;

  const avatarUrl = profilePictureUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userEmail || userName)}&backgroundColor=18181b,27272a,3f3f46&textColor=ffffff`;

  return (
    <>
      <motion.div
        layoutId={layoutId}
        onClick={() => setIsOpen(true)}
        className="group relative rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer aspect-[4/3]"
      >
        <div className="absolute inset-0 flex items-center justify-center gap-2 p-4">
          {movies.slice(0, 3).map((movie) => (
            <motion.div
              key={movie._id}
              layoutId={`poster-${layoutId}-${movie._id}`}
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
            </motion.div>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/80 to-transparent pt-12 pb-4 px-4">
          <div className="flex items-center gap-2.5">
            <motion.div layoutId={`avatar-${layoutId}`}>
              <Avatar className="h-8 w-8 ring-2 ring-background shrink-0">
                <AvatarImage src={avatarUrl} alt={userName} />
                <AvatarFallback className="text-xs">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="flex-1 min-w-0">
              <motion.h3
                layoutId={`name-${layoutId}`}
                className="text-sm font-semibold truncate"
              >
                {userName}
              </motion.h3>
              <p className="text-xs text-muted-foreground">
                {movieCount} movie{movieCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              layoutId={layoutId}
              className="relative w-full max-w-2xl max-h-[80vh] bg-card rounded-2xl overflow-hidden border border-border z-10 flex flex-col shadow-xl"
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center bg-background/50 hover:bg-accent rounded-full border border-border text-foreground transition-colors backdrop-blur-sm"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Header with user info */}
              <div className="p-6 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <motion.div layoutId={`avatar-${layoutId}`}>
                    <Avatar className="h-12 w-12 ring-2 ring-background">
                      <AvatarImage src={avatarUrl} alt={userName} />
                      <AvatarFallback className="text-sm">
                        {userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <div>
                    <motion.h3
                      layoutId={`name-${layoutId}`}
                      className="text-lg font-semibold"
                    >
                      {userName}
                    </motion.h3>
                    <p className="text-sm text-muted-foreground">
                      {movieCount} movie{movieCount !== 1 ? "s" : ""} in watchlist
                    </p>
                  </div>
                </div>
              </div>

              {/* Movies grid */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {movies.map((movie) => (
                    <motion.div
                      key={movie._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted"
                    >
                      {movie.poster && movie.poster !== "N/A" ? (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="h-5 w-5 text-muted-foreground/50" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-xs font-medium text-white truncate">
                          {movie.title}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* View full watchlist button */}
              <div className="p-4 border-t border-border">
                <Link
                  href={`/share?userId=${encodeURIComponent(userId)}`}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity text-sm"
                >
                  View full watchlist
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
