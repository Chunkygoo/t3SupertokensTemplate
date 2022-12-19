// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]), // this gets set by NextJS
  DATABASE_URL: z.string().url(),
  APP_URL: z.string(),
  SUPERTOKENS_CONNECTION_URI: z.string(),
  SUPERTOKENS_API_KEY: z.string(),
  SUPERTOKENS_DASHBOARD_API_KEY: z.string(),
  SUPERTOKENS_GOOGLE_CLIENT_ID: z.string(),
  SUPERTOKENS_GOOGLE_CLIENT_SECRET: z.string(),
  SUPERTOKENS_EMAIL_VERIFICATION: z.enum(["OPTIONAL", "REQUIRED"]),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
};
