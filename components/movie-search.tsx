"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMovieSearch, type OmdbSearchResult } from "@/hooks/use-movie-search";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Film, Search, Loader2, X } from "lucide-react";

export function MovieSearch() {
  const { query, setQuery, results, isLoading, error, selectMovie } = useMovieSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const addMovie = useMutation(api.movies.addMovie);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = async (result: OmdbSearchResult) => {
    setIsAdding(result.imdbID);
    try {
      const details = await selectMovie(result.Title);
      if (details) {
        await addMovie({
          title: details.Title,
          year: details.Year,
          poster: details.Poster !== "N/A" ? details.Poster : "",
          rating: details.imdbRating !== "N/A" ? details.imdbRating : "N/A",
          genre: details.Genre !== "N/A" ? details.Genre : "Unknown",
          description: details.Plot !== "N/A" ? details.Plot : "",
        });
      }
    } catch {
      // Silently fail
    } finally {
      setIsAdding(null);
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search movies to add..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.length >= 3 && setIsOpen(true)}
          className="pl-9 pr-9"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && query.length >= 3 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-sm text-muted-foreground">{error}</div>
          ) : results.length > 0 ? (
            results.map((result) => (
              <button
                key={result.imdbID}
                onClick={() => handleSelect(result)}
                disabled={isAdding === result.imdbID}
                className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
              >
                <Avatar className="h-10 w-14 rounded-sm">
                  <AvatarImage src={result.Poster} alt={result.Title} />
                  <AvatarFallback className="rounded-sm bg-muted">
                    <Film className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{result.Title}</p>
                  <p className="text-xs text-muted-foreground">{result.Year}</p>
                </div>
                {isAdding === result.imdbID && (
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                )}
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">No results found.</div>
          )}
        </div>
      )}
    </div>
  );
}
