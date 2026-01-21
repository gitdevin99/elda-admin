import { router } from './init';
import { tracksRouter } from './routers/tracks';

export const appRouter = router({
  tracks: tracksRouter,
});

export type AppRouter = typeof appRouter;
