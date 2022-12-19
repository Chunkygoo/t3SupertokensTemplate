import { router } from "../trpc";
import { userInfoRouter } from "./userInfo";

export const appRouter = router({
  userInfo: userInfoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
