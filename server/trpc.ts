import { initTRPC } from '@trpc/server';
import { tracksRouter } from './routers/tracks';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  tracks: tracksRouter,
});

export type AppRouter = typeof appRouter;
