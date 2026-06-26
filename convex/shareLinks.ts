import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const createShareLink = mutation({
  args: {
    userName: v.string(),
    userEmail: v.string(),
    profilePictureUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db.query("shareLinks").collect();
    const userLink = existing.find((link) => link.userId === identity.tokenIdentifier);

    if (userLink) {
      const needsUpdate =
        !userLink.userName ||
        !userLink.userEmail ||
        userLink.userName !== args.userName ||
        userLink.userEmail !== args.userEmail ||
        userLink.profilePictureUrl !== args.profilePictureUrl;

      if (needsUpdate) {
        await ctx.db.patch(userLink._id, {
          userName: args.userName,
          userEmail: args.userEmail,
          profilePictureUrl: args.profilePictureUrl,
        });
      }
      return userLink.code;
    }

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

    return code;
  },
});

export const getMoviesByShareCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("shareLinks")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .unique();

    if (!link) return null;

    const movies = await ctx.db
      .query("movies")
      .withIndex("by_userId", (q) => q.eq("userId", link.userId))
      .order("desc")
      .take(100);

    return {
      movies,
      userName: link.userName || "Someone",
      userEmail: link.userEmail || "",
      profilePictureUrl: link.profilePictureUrl || "",
    };
  },
});

export const listSharedWatchlists = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const allLinks = await ctx.db.query("shareLinks").collect();
    const otherLinks = allLinks.filter((link) => link.userId !== identity.tokenIdentifier);

    const results = [];
    for (const link of otherLinks) {
      const movies = await ctx.db
        .query("movies")
        .withIndex("by_userId", (q) => q.eq("userId", link.userId))
        .order("desc")
        .take(100);

      if (movies.length > 0) {
        results.push({
          code: link.code,
          userName: link.userName || "Someone",
          userEmail: link.userEmail || "",
          profilePictureUrl: link.profilePictureUrl || "",
          movieCount: movies.length,
          movies,
        });
      }
    }

    return results;
  },
});
