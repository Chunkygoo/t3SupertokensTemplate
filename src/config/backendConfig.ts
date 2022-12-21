import { TRPCError } from "@trpc/server";
import { deleteUser } from "supertokens-node";
import Dashboard from "supertokens-node/recipe/dashboard";
import EmailVerification from "supertokens-node/recipe/emailverification";
import SessionNode from "supertokens-node/recipe/session";
import ThirdPartyEmailPasswordNode from "supertokens-node/recipe/thirdpartyemailpassword";
import type { TypeInput } from "supertokens-node/types";
import { env } from "../env/server.mjs";
import { prisma } from "../server/db/client";

export const backendConfig = (): TypeInput => {
  return {
    framework: "express",
    supertokens: {
      connectionURI: env.SUPERTOKENS_CONNECTION_URI,
      apiKey: env.SUPERTOKENS_API_KEY,
    },
    appInfo: {
      appName: "Subbies",
      apiDomain: env.NEXT_PUBLIC_APP_URL,
      websiteDomain: env.NEXT_PUBLIC_APP_URL,
      apiBasePath: "/api/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      ThirdPartyEmailPasswordNode.init({
        override: {
          functions: (originalImplementation) => {
            return {
              ...originalImplementation,
              // here we are only overriding the function that's responsible
              // for signing in or signing up a user.
              thirdPartySignInUp: async (input) => {
                const res = await originalImplementation.thirdPartySignInUp(
                  input
                );
                if (res.createdNewUser) {
                  // Only run the below logic for signUp, not signIn
                  try {
                    // created user, we need to create a new userInfo record for that user
                    await prisma.userInfo.create({
                      data: {
                        id: res.user.id,
                        email: res.user.email,
                      },
                    });
                  } catch (error) {
                    await deleteUser(res.user.id);
                    throw new TRPCError({
                      code: "BAD_REQUEST",
                      message: (error as Error).message,
                      cause: error,
                    });
                  }
                }
                return res;
              },
              emailPasswordSignUp: async (input) => {
                const res = await originalImplementation.emailPasswordSignUp(
                  input
                );
                if (res.status === "OK") {
                  try {
                    // created user, we need to create a new userInfo record for that user
                    await prisma.userInfo.create({
                      data: {
                        id: res.user.id,
                        email: res.user.email,
                      },
                    });
                  } catch (error) {
                    await deleteUser(res.user.id);
                    throw new TRPCError({
                      code: "BAD_REQUEST",
                      message: (error as Error).message,
                      cause: error,
                    });
                  }
                }
                return res;
              },
            };
          },
        },
        providers: [
          ThirdPartyEmailPasswordNode.Google({
            clientId: env.SUPERTOKENS_GOOGLE_CLIENT_ID,
            clientSecret: env.SUPERTOKENS_GOOGLE_CLIENT_SECRET,
          }),
        ],
      }),
      SessionNode.init(),
      EmailVerification.init({ mode: env.SUPERTOKENS_EMAIL_VERIFICATION }),
      Dashboard.init({
        apiKey: env.SUPERTOKENS_DASHBOARD_API_KEY,
      }),
    ],
    isInServerlessEnv: true,
  };
};
