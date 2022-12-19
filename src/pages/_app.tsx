import { type AppType } from "next/app";

import { trpc } from "../utils/trpc";

import SuperTokensReact, { SuperTokensWrapper } from "supertokens-auth-react";
import { frontendConfig } from "../config/frontendConfig";
import "../styles/globals.css";

if (typeof window !== "undefined") {
  // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'
  SuperTokensReact.init(frontendConfig);
}

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <SuperTokensWrapper>
      <Component {...pageProps} />;
    </SuperTokensWrapper>
  );
};

export default trpc.withTRPC(MyApp);
