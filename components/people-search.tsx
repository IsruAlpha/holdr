"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Film, Eye } from "lucide-react";
import { TrophyIcon } from "@/components/trophy-icon";

export function PeopleSearch() {
  const [query, setQuery] = useState("");
  const results = useQuery(
    api.shareLinks.searchShareLinks,
    query.length >= 2 ? { query } : "skip"
  );
  const leaderboard = useQuery(api.shareLinks.getLeaderboard);

  return (
    <div className="mt-12 sm:mt-16">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Community</h2>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Search for people and see their watchlists.
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search people by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {query.length >= 2 && results !== undefined && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </h3>
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground">No people found.</p>
          ) : (
            <div className="grid gap-3">
              {results.map((person) => (
                <PersonCard key={person.userId} person={person} />
              ))}
            </div>
          )}
        </div>
      )}

      {leaderboard !== undefined && leaderboard.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-medium">Top Watchers</h3>
          </div>
          <div className="grid gap-3">
            {leaderboard.slice(0, 10).map((person, i) => (
              <LeaderboardCard key={person.userId} person={person} rank={i + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PersonCard({ person }: {
  person: {
    code: string;
    userName: string;
    userEmail: string;
    profilePictureUrl: string;
    totalMovies: number;
    watchedCount: number;
    score: number;
  };
}) {
  const avatarUrl = person.profilePictureUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(person.userEmail || person.userName)}&backgroundColor=18181b,27272a,3f3f46&textColor=ffffff`;

  return (
    <Link
      href={`/share?code=${person.code}`}
      className="flex items-center gap-3 rounded-xl border bg-card p-3 sm:p-4 hover:shadow-md transition-shadow"
    >
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={avatarUrl} alt={person.userName} />
        <AvatarFallback className="text-xs">
          {person.userName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{person.userName}</p>
        <p className="text-xs text-muted-foreground">
          {person.totalMovies} movie{person.totalMovies !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
        <Eye className="h-3.5 w-3.5" />
        <span>{person.watchedCount} watched</span>
      </div>
    </Link>
  );
}

function LeaderboardCard({ person, rank }: {
  person: {
    code: string;
    userName: string;
    userEmail: string;
    profilePictureUrl: string;
    totalMovies: number;
    watchedCount: number;
    score: number;
  };
  rank: number;
}) {
  const avatarUrl = person.profilePictureUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(person.userEmail || person.userName)}&backgroundColor=18181b,27272a,3f3f46&textColor=ffffff`;

  return (
    <Link
      href={`/share?code=${person.code}`}
      className="flex items-center gap-3 rounded-xl border bg-card p-3 sm:p-4 hover:shadow-md transition-shadow"
    >
      <div className="w-7 text-center shrink-0">
        {rank <= 3 ? (
          <TrophyIcon className="h-5 w-5 mx-auto" style={{ color: rank === 1 ? '#facc15' : rank === 2 ? '#d1d5db' : '#b45309' }} />
        ) : (
          <span className="text-sm font-mono text-muted-foreground">#{rank}</span>
        )}
      </div>
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarImage src={avatarUrl} alt={person.userName} />
        <AvatarFallback className="text-xs">
          {person.userName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate text-sm">{person.userName}</p>
        <p className="text-xs text-muted-foreground">
          {person.totalMovies} in list
        </p>
      </div>
      <Badge variant="secondary" className="text-xs shrink-0 gap-1">
        <Eye className="h-3 w-3" />
        {person.watchedCount}
      </Badge>
    </Link>
  );
}
