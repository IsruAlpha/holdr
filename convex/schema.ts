import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  numbers: defineTable({
    value: v.number(),
  }),
  movies: defineTable({
    userId: v.string(),
    title: v.string(),
    year: v.string(),
    poster: v.string(),
    rating: v.string(),
    genre: v.string(),
    description: v.string(),
    watched: v.boolean(),
    addedAt: v.number(),
  }).index("by_userId", ["userId"]),
  shareLinks: defineTable({
    code: v.string(),
    userId: v.string(),
    userName: v.optional(v.string()),
    userEmail: v.optional(v.string()),
    profilePictureUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_code", ["code"]),
});
