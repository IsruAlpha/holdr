import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";

function displayName(userName?: string, userEmail?: string): string {
  if (userName && userName.trim()) return userName.trim();
  if (userEmail && userEmail.trim()) {
    const prefix = userEmail.split("@")[0];
    // Capitalise first letter and replace dots/underscores/hyphens with spaces
    return prefix
      .replace(/[._-]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return "Holdr User";
}

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
    const rawIdentityId = identity.tokenIdentifier.includes("|") ? identity.tokenIdentifier.split("|")[1] : identity.tokenIdentifier;
    const userLink = existing.find((link) => {
      const linkRawId = link.userId.includes("|") ? link.userId.split("|")[1] : link.userId;
      return linkRawId === rawIdentityId;
    });

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

export const backfillShareLink = internalMutation({
  args: {
    userId: v.string(),
    userName: v.string(),
    userEmail: v.string(),
    profilePictureUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("shareLinks").collect();
    const userLink = existing.find((link) => link.userId === args.userId);

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

    const code = args.userId
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(-12)
      .toLowerCase();

    await ctx.db.insert("shareLinks", {
      code,
      userId: args.userId,
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
      .first();

    if (!link) return null;

    const linkRawId = link.userId.includes("|") ? link.userId.split("|")[1] : link.userId;

    // Fetch movies. We must fetch a larger chunk and filter by normalized ID
    // because movies might be stored under the issuer-prefixed token identifier
    // whereas the link might be stored under the raw WorkOS ID.
    const allMovies = await ctx.db.query("movies").order("desc").collect();
    const movies = allMovies.filter((m) => {
      const mRawId = m.userId.includes("|") ? m.userId.split("|")[1] : m.userId;
      return mRawId === linkRawId;
    }).slice(0, 100);

    return {
      movies,
      userName: displayName(link.userName, link.userEmail),
      userEmail: link.userEmail || "",
      profilePictureUrl: link.profilePictureUrl || "",
    };
  },
});

export const getMoviesByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const movies = await ctx.db
      .query("movies")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(100);

    if (movies.length === 0) return null;

    const rawArgsUserId = args.userId.includes("|") ? args.userId.split("|")[1] : args.userId;
    const link = await ctx.db.query("shareLinks").collect();
    const userLink = link.find((l) => {
      const lRawId = l.userId.includes("|") ? l.userId.split("|")[1] : l.userId;
      return lRawId === rawArgsUserId;
    });

    return {
      movies,
      userName: displayName(userLink?.userName, userLink?.userEmail),
      userEmail: userLink?.userEmail || "",
      profilePictureUrl: userLink?.profilePictureUrl || "",
    };
  },
});

export const listSharedWatchlists = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const allMovies = await ctx.db.query("movies").order("desc").take(1000);
    const otherMovies = allMovies.filter((m) => m.userId !== identity.tokenIdentifier);

    const allLinks = await ctx.db.query("shareLinks").collect();
    const linkMap = new Map(
      allLinks.map((link) => {
        const rawId = link.userId.includes("|") ? link.userId.split("|")[1] : link.userId;
        return [rawId, link];
      })
    );

    const grouped = new Map<string, typeof otherMovies>();
    for (const movie of otherMovies) {
      const existing = grouped.get(movie.userId) || [];
      existing.push(movie);
      grouped.set(movie.userId, existing);
    }

    const results = [];
    for (const [userId, movies] of grouped) {
      const rawUserId = userId.includes("|") ? userId.split("|")[1] : userId;
      const link = linkMap.get(rawUserId);

      const shareCode = link?.code || userId.replace(/[^a-zA-Z0-9]/g, "").slice(-12).toLowerCase();

      results.push({
        code: shareCode,
        userId: userId,
        userName: displayName(link?.userName, link?.userEmail),
        userEmail: link?.userEmail || "",
        profilePictureUrl: link?.profilePictureUrl || "",
        movieCount: movies.length,
        movies: movies.slice(0, 100),
      });
    }

    return results;
  },
});
