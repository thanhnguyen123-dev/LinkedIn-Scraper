import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";
import { connectionRouter } from "./router/connection";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  connection: connectionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
