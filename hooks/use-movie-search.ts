"use client";

import { useState, useCallback, useRef } from "react";

const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY || "";
const OMDB_BASE = "https://www.omdbapi.com";

export interface OmdbSearchResult {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

export interface OmdbMovieDetail {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  imdbRating: string;
  Genre: string;
  Plot: string;
  Response: string;
}

interface SearchResponse {
  Search: OmdbSearchResult[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export function useMovieSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OmdbSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery.length < 3) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${OMDB_BASE}/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(searchQuery)}&type=movie`
        );
        const data: SearchResponse = await res.json();

        if (data.Response === "True" && data.Search) {
          setResults(data.Search.slice(0, 8));
        } else {
          setResults([]);
          if (data.Error) {
            setError(data.Error);
          }
        }
      } catch {
        setError("Failed to search movies");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);
  }, []);

  const selectMovie = useCallback(
    async (title: string): Promise<OmdbMovieDetail | null> => {
      try {
        const res = await fetch(
          `${OMDB_BASE}/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`
        );
        const data: OmdbMovieDetail = await res.json();

        if (data.Response === "True") {
          setQuery("");
          setResults([]);
          return data;
        }
        return null;
      } catch {
        return null;
      }
    },
    []
  );

  return {
    query,
    setQuery: search,
    results,
    isLoading,
    error,
    selectMovie,
  };
}
