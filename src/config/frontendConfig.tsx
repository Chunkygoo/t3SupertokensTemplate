import Router from "next/router";
import EmailVerification from "supertokens-auth-react/recipe/emailverification";
import SessionReact from "supertokens-auth-react/recipe/session";
import ThirdPartyEmailPassword, {
  Google,
} from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import type { WindowHandlerInterface } from "supertokens-website/utils/windowHandler/types";
import { env } from "../env/client.mjs";

export const frontendConfig = {
  appInfo: {
    appName: "Subbies",
    apiDomain: env.NEXT_PUBLIC_APP_URL,
    websiteDomain: env.NEXT_PUBLIC_APP_URL,
    apiBasePath: "/api/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    EmailVerification.init({
      mode: "OPTIONAL",
    }),
    SessionReact.init(),
    ThirdPartyEmailPassword.init({
      override: {
        functions: (originalImplementation) => {
          return {
            ...originalImplementation,
            // we will only be overriding what happens when a user
            // clicks the sign in or sign up button.
            getAuthorisationURLWithQueryParamsAndSetState: async function (
              input
            ) {
              const shadowRoot =
                document.querySelector("#supertokens-root")?.shadowRoot;
              if (shadowRoot) {
                (
                  shadowRoot.querySelector(
                    `[data-supertokens~='providerButton']`
                  ) as HTMLButtonElement
                ).disabled = true;
                (
                  shadowRoot.querySelector(
                    `[data-supertokens~='providerButtonText']`
                  ) as HTMLButtonElement
                ).textContent = "Signing in...";
              }
              // then call the default behaviour as show below
              return originalImplementation.getAuthorisationURLWithQueryParamsAndSetState(
                input
              );
            },
          };
        },
        components: {
          ThirdPartySignInAndUpCallbackTheme_Override: () => {
            return (
              <div className="flex h-screen">
                <div className="m-auto">
                  <h1 className="mb-2 text-2xl">
                    You are getting redirected...
                  </h1>
                  <div>
                    <p className="mt-4">
                      Here is a cookie while you are waiting 🍪
                    </p>
                    <p>Team SportsConnect</p>
                  </div>
                </div>
              </div>
            );
          },
        },
      },
      signInAndUpFeature: {
        disableDefaultUI: true,
        providers: [Google.init()],
      },
      resetPasswordUsingTokenFeature: {
        disableDefaultUI: true,
      },
      style: {
        button: {
          backgroundColor: "#0076ff",
          border: "0px",
          margin: "0 auto",
        },
        superTokensBranding: {
          display: "none",
        },
      },
    }),
  ],
  // this is so that the SDK uses the next router for navigation
  windowHandler: (oI: WindowHandlerInterface) => {
    return {
      ...oI,
      location: {
        ...oI.location,
        setHref: (href: string) => {
          Router.push(href);
        },
      },
    };
  },
};
