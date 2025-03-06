import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

import { Connection } from "../../../db/src/schema";

import { sql } from "drizzle-orm";

export const connectionRouter = createTRPCRouter({
  insertConnection: protectedProcedure
    .input(
      // array of connection objects
      z.object({
        connections: z.array(
          z.object({
            entityUrn: z.string().min(1),
            firstName: z.string().min(1),
            lastName: z.string().min(1),
            headline: z.string().min(1),
            profileUrl: z.string().min(1),
          })
        )
      })
    )
    .mutation(async ({ ctx, input }) => {
    const connections = input.connections;

    const userFieldsArray = connections.map((connection) => {
      return {
        entityUrn: connection.entityUrn,
        firstName: connection.firstName,
        lastName: connection.lastName,
        headline: connection.headline,
        profileUrl: connection.profileUrl,
      };
    });

    try {
      await ctx.db.insert(Connection).values(userFieldsArray).onConflictDoNothing();
      return {
        success: true,
        message: "Connections inserted successfully",
      }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Failed to insert connections",
      };
    } 
  }),

  countConnections: protectedProcedure.query(async ({ ctx }) => {
    const count = await ctx.db.select({ count: sql<number>`count(*)` }).from(Connection);
    return count[0]?.count;
  }),
    
});
