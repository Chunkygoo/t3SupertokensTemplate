import { TRPCError } from "@trpc/server";
import { type GetServerSidePropsContext } from "next";
import { Error as SuperTokensError } from "supertokens-node";
import Session from "supertokens-node/recipe/session";
/**
 * Wrapper for unstable_getServerSession https://next-auth.js.org/configuration/nextjs
 * See example usage in trpc createContext or the restricted API route
 */
export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  const { req, res } = ctx;
  try {
    return await Session.getSession(req, res);
  } catch (error) {
    if (SuperTokensError.isErrorFromSuperTokens(error)) {
      if (error.type === "TRY_REFRESH_TOKEN") {
        throw new TRPCError({
          code: "UNAUTHORIZED", // UNAUTHORIZED signals 401 which automatically triggers the frontend ST refresh API
          message: error.type,
          cause: error,
        });
      } else if (
        error.type === "UNAUTHORISED" &&
        error.message ===
          "Session does not exist. Are you sending the session tokens in the request as cookies?"
      ) {
        //  happens when the user logs in at least once and then logs out === unauthenticated
        return null; // null is returned as the sesion object. getServerAuthSession is called everytime an API is hit even if the user is not logged in. If the user has not
        // logged in and Session.getSession(req, res); is called, this error will occur. But this error is expected so we return null to indicate the user is not logged in
      }
    }
    if (
      error instanceof Error &&
      error.message ===
        "Initialisation not done. Did you forget to call the SuperTokens.init function?" // Unauthenticated
    ) {
      //  happens when the user has not logged in even once
      return null; // null is returned as the sesion object
    }
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Random error occurred - should never get here",
      cause: error,
    });
  }
};
