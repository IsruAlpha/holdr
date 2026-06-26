"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Film, Trash2, ListFilter, Columns, ExternalLink } from "lucide-react";

// --- TYPE DEFINITIONS ---
export interface Movie {
  _id: string;
  title: string;
  year: string;
  poster: string;
  rating: string;
  genre: string;
  description: string;
  watched: boolean;
  addedAt: number;
}

// --- PROPS INTERFACE ---
interface MovieDataTableProps {
  movies: Movie[];
  onToggleWatched: (movieId: string) => void;
  onRemoveMovie: (movieId: string) => void;
}

// --- STATUS BADGE VARIANTS ---
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

// --- MAIN COMPONENT ---
export const MovieDataTable = ({ movies, onToggleWatched, onRemoveMovie }: MovieDataTableProps) => {
  const [genreFilter, setGenreFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    new Set(["poster", "title", "year", "rating", "genre", "status", "actions"])
  );

  const allGenres = React.useMemo(() => {
    const genreSet = new Set<string>();
    movies.forEach((movie) => {
      movie.genre.split(", ").forEach((g) => genreSet.add(g));
    });
    return Array.from(genreSet).sort();
  }, [movies]);

  const filteredMovies = React.useMemo(() => {
    return movies.filter((movie) => {
      const genreMatch =
        genreFilter === "" || movie.genre.toLowerCase().includes(genreFilter.toLowerCase());
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "watched" && movie.watched) ||
        (statusFilter === "toWatch" && !movie.watched);
      return genreMatch && statusMatch;
    });
  }, [movies, genreFilter, statusFilter]);

  const toggleColumn = (column: string) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(column)) {
        newSet.delete(column);
      } else {
        newSet.add(column);
      }
      return newSet;
    });
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeInOut" as const,
      },
    }),
  };

  const tableHeaders: { key: string; label: string }[] = [
    { key: "poster", label: "" },
    { key: "title", label: "Title" },
    { key: "year", label: "Year" },
    { key: "rating", label: "Rating" },
    { key: "genre", label: "Genre" },
    { key: "status", label: "Status" },
    { key: "actions", label: "" },
  ];

  const uniqueGenres = allGenres;

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
        <div className="flex flex-1 gap-2 sm:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 text-xs sm:text-sm">
                <ListFilter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Genre</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Genre</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={genreFilter === ""}
                onCheckedChange={() => setGenreFilter("")}
              >
                All
              </DropdownMenuCheckboxItem>
              {uniqueGenres.map((genre) => (
                <DropdownMenuCheckboxItem
                  key={genre}
                  checked={genreFilter === genre}
                  onCheckedChange={() => setGenreFilter(genre)}
                >
                  {genre}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 text-xs sm:text-sm">
                <ListFilter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Status</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={statusFilter === "all"}
                onCheckedChange={() => setStatusFilter("all")}
              >
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "toWatch"}
                onCheckedChange={() => setStatusFilter("toWatch")}
              >
                To Watch
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "watched"}
                onCheckedChange={() => setStatusFilter("watched")}
              >
                Watched
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 text-xs sm:text-sm">
              <Columns className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Columns</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {tableHeaders.map((header) => (
              <DropdownMenuCheckboxItem
                key={header.key}
                className="capitalize"
                checked={visibleColumns.has(header.key)}
                onCheckedChange={() => toggleColumn(header.key)}
              >
                {header.key}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile card layout */}
      <div className="block sm:hidden">
        {filteredMovies.length > 0 ? (
          <div className="divide-y">
            {filteredMovies.map((movie, index) => (
              <motion.div
                key={movie._id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                className="p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex gap-3">
                  {visibleColumns.has("poster") && (
                    <Avatar className="h-20 w-14 rounded-lg shrink-0">
                      <AvatarImage src={movie.poster} alt={movie.title} />
                      <AvatarFallback className="rounded-lg bg-muted">
                        <Film className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      {visibleColumns.has("title") && (
                        <div className="min-w-0">
                          <h3 className="font-medium truncate">{movie.title}</h3>
                          {movie.description && (
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {movie.description}
                            </p>
                          )}
                        </div>
                      )}
                      {visibleColumns.has("status") && (
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
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      {visibleColumns.has("year") && <span>{movie.year}</span>}
                      {visibleColumns.has("rating") && (
                        <span className="font-medium text-foreground">{movie.rating}/10</span>
                      )}
                    </div>
                    {visibleColumns.has("genre") && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {movie.genre.split(", ").slice(0, 2).map((g) => (
                          <Badge key={g} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {g}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {visibleColumns.has("actions") && (
                      <div className="flex items-center gap-1 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleWatched(movie._id)}
                          title={movie.watched ? "Mark as to watch" : "Mark as watched"}
                          className="h-7 px-2 text-xs gap-1"
                        >
                          {movie.watched ? (
                            <ExternalLink className="h-3 w-3" />
                          ) : (
                            <Film className="h-3 w-3" />
                          )}
                          {movie.watched ? "Rewatch" : "Watched"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveMovie(movie._id)}
                          title="Remove"
                          className="h-7 px-2 text-xs gap-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Film className="h-8 w-8" />
              <p>No movies in your watchlist yet.</p>
              <p className="text-xs">Search above to add movies.</p>
            </div>
          </div>
        )}
      </div>

      {/* Desktop table layout */}
      <div className="hidden sm:block relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {tableHeaders
                .filter((header) => visibleColumns.has(header.key))
                .map((header) => (
                  <TableHead key={header.key}>{header.label}</TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie, index) => (
                <motion.tr
                  key={movie._id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  {visibleColumns.has("poster") && (
                    <TableCell>
                      <Avatar className="h-16 w-12 rounded-sm">
                        <AvatarImage src={movie.poster} alt={movie.title} />
                        <AvatarFallback className="rounded-sm bg-muted">
                          <Film className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                  )}

                  {visibleColumns.has("title") && (
                    <TableCell className="font-medium max-w-[200px]">
                      <div className="truncate" title={movie.title}>
                        {movie.title}
                      </div>
                      {movie.description && (
                        <p className="text-xs text-muted-foreground truncate max-w-[200px] mt-0.5" title={movie.description}>
                          {movie.description}
                        </p>
                      )}
                    </TableCell>
                  )}

                  {visibleColumns.has("year") && <TableCell>{movie.year}</TableCell>}

                  {visibleColumns.has("rating") && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">{movie.rating}</span>
                        <span className="text-xs text-muted-foreground">/10</span>
                      </div>
                    </TableCell>
                  )}

                  {visibleColumns.has("genre") && (
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {movie.genre.split(", ").slice(0, 2).map((g) => (
                          <Badge key={g} variant="secondary" className="text-xs">
                            {g}
                          </Badge>
                        ))}
                        {movie.genre.split(", ").length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{movie.genre.split(", ").length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  )}

                  {visibleColumns.has("status") && (
                    <TableCell>
                      <Badge
                        className={cn(
                          badgeVariants({
                            variant: movie.watched ? "watched" : "toWatch",
                          })
                        )}
                      >
                        {movie.watched ? "Watched" : "To Watch"}
                      </Badge>
                    </TableCell>
                  )}

                  {visibleColumns.has("actions") && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onToggleWatched(movie._id)}
                          title={movie.watched ? "Mark as to watch" : "Mark as watched"}
                        >
                          {movie.watched ? (
                            <ExternalLink className="h-4 w-4" />
                          ) : (
                            <Film className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveMovie(movie._id)}
                          title="Remove from watchlist"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumns.size} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Film className="h-8 w-8" />
                    <p>No movies in your watchlist yet.</p>
                    <p className="text-xs">Search above to add movies.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
