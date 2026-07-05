import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listMovies = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const movies = await ctx.db
      .query("movies")
      .withIndex("by_userId", (q) => q.eq("userId", identity.tokenIdentifier))
      .order("desc")
      .take(100);
    return movies;
  },
});

export const addMovie = mutation({
  args: {
    title: v.string(),
    year: v.string(),
    poster: v.string(),
    rating: v.string(),
    genre: v.string(),
    description: v.string(),
    userName: v.optional(v.string()),
    userEmail: v.optional(v.string()),
    profilePictureUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (args.userName && args.userEmail) {
      const existingLinks = await ctx.db.query("shareLinks").collect();
      const userLink = existingLinks.find((l) => l.userId === identity.tokenIdentifier);
      if (!userLink) {
        const code = identity.tokenIdentifier
          .replace(/[^a-zA-Z0-9]/g, "")
          .slice(-12)
          .toLowerCase();
        await ctx.db.insert("shareLinks", {
          code,
          userId: identity.tokenIdentifier,
          userName: args.userName,
          userEmail: args.userEmail,
          profilePictureUrl: args.profilePictureUrl,
          createdAt: Date.now(),
        });
      }
    }

    const id = await ctx.db.insert("movies", {
      userId: identity.tokenIdentifier,
      title: args.title,
      year: args.year,
      poster: args.poster,
      rating: args.rating,
      genre: args.genre,
      description: args.description,
      watched: false,
      addedAt: Date.now(),
    });
    return id;
  },
});

export const removeMovie = mutation({
  args: { movieId: v.id("movies") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const doc = await ctx.db.get(args.movieId);
    if (!doc) {
      throw new Error("Movie not found");
    }
    if (doc.userId !== identity.tokenIdentifier) {
      throw new Error("Not authorized");
    }
    await ctx.db.delete(args.movieId);
  },
});

export const toggleWatched = mutation({
  args: { movieId: v.id("movies") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const doc = await ctx.db.get(args.movieId);
    if (!doc) {
      throw new Error("Movie not found");
    }
    if (doc.userId !== identity.tokenIdentifier) {
      throw new Error("Not authorized");
    }
    await ctx.db.patch(args.movieId, { watched: !doc.watched });
  },
});
