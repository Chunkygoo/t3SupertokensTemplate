import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../trpc";

export const userInfoRouter = router({
  getCurrentUserInfo: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.userInfo.findUniqueOrThrow({
        where: {
          id: ctx.session.getUserId(),
        },
      });
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: (error as Error).message,
        cause: error,
      });
    }
  }),
});
