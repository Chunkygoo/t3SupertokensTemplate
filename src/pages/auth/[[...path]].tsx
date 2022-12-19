import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import SuperTokensReact from "supertokens-auth-react";

const SuperTokensComponentNoSSR = dynamic(
  import("supertokens-auth-react").then((module) => module.getRoutingComponent),
  {
    ssr: false,
  }
);

export default function Auth() {
  const router = useRouter();

  useEffect(() => {
    // if the user visits a page that is not handled by us
    // (like /auth/asdjklnogjk), then we redirect them back to the /auth/loginsignup page.
    if (!SuperTokensReact.canHandleRoute()) {
      router.push("/auth/loginsignup");
    }
  }, [router]);

  return (
    <div className="flex h-[75vh]">
      <div className="m-auto">
        <SuperTokensComponentNoSSR />
      </div>
    </div>
  );
}
