"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Eye, EyeOff, Trash2, X, Star, Plus } from "lucide-react";
import type { Movie } from "@/components/movie-data-table";

const badgeVariants = cva("capitalize text-white", {
  variants: {
    variant: {
      watched: "bg-green-500 hover:bg-green-600",
      toWatch: "bg-yellow-500 hover:bg-yellow-600",
    },
  },
  defaultVariants: {
    variant: "toWatch",
  },
});

interface MovieDetailSheetProps {
  movie: Movie | null;
  onClose: () => void;
  onToggleWatched?: (movieId: string) => void;
  onRemoveMovie?: (movieId: string) => void;
  onAddToWatchlist?: (movie: Movie) => void;
  added?: boolean;
  adding?: boolean;
  mode?: "own" | "share";
}

export function MovieDetailSheet({
  movie,
  onClose,
  onToggleWatched,
  onRemoveMovie,
  onAddToWatchlist,
  added = false,
  adding = false,
  mode = "own",
}: MovieDetailSheetProps) {
  return (
    <AnimatePresence>
      {movie && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 35, stiffness: 400 }}
            className="relative w-full sm:max-w-lg bg-card rounded-t-2xl sm:rounded-2xl border border-border shadow-xl z-10 max-h-[85vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center bg-background/50 hover:bg-accent rounded-full border border-border text-foreground transition-colors backdrop-blur-sm"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Poster */}
            <div className="relative h-72 sm:h-80 w-full overflow-hidden">
              {movie.poster && movie.poster !== "N/A" ? (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">No poster</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-6 -mt-16 relative z-10">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold tracking-tight">{movie.title}</h2>
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    {movie.year && <span>{movie.year}</span>}
                    {movie.rating && movie.rating !== "N/A" && (
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        {movie.rating}/10
                      </span>
                    )}
                  </div>
                </div>
                {mode === "own" && (
                  <Badge
                    className={cn(
                      badgeVariants({
                        variant: movie.watched ? "watched" : "toWatch",
                      })
                    )}
                  >
                    {movie.watched ? "Watched" : "To Watch"}
                  </Badge>
                )}
              </div>

              {/* Genres */}
              {movie.genre && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {movie.genre.split(", ").map((g) => (
                    <Badge key={g} variant="secondary" className="text-xs">
                      {g}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Description */}
              {movie.description && (
                <div className="mb-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Synopsis
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {movie.description}
                  </p>
                </div>
              )}

              {/* Actions */}
              {mode === "own" ? (
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => {
                      onToggleWatched?.(movie._id);
                      onClose();
                    }}
                    className="flex-1 gap-2"
                  >
                    {movie.watched ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Mark as To Watch
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Mark as Watched
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      onRemoveMovie?.(movie._id);
                      onClose();
                    }}
                    className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t border-border">
                  {added ? (
                    <Button disabled className="w-full gap-2">
                      Added to your watchlist
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onAddToWatchlist?.(movie)}
                      disabled={adding}
                      className="w-full gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {adding ? "Adding..." : "Add to my watchlist"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
