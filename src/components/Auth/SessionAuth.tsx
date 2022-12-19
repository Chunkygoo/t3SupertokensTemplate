import { useRouter } from "next/router";
import {
  SessionAuth as STSessionAuth,
  useSessionContext,
} from "supertokens-auth-react/recipe/session";
import Spinner from "../Common/Spinner";

export default function SessionAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const session = useSessionContext();
  const loading = session.loading;
  const loadedNotAuth = !session.loading && !session.doesSessionExist;

  // // use this if EMAIL_VERIFICATION === "REQUIRED". The point of my own SessionAuth component is to display a loader.
  // // even if we do not use lines 21 to 37, we will still get redirected to the right page: /auth/verify-email?rid=emailverification
  // // as that is done by STSessionAuth. But STSessionAuth does not display a loader. That is why we need my own SessionAuth component
  // const emailNotVerified =
  //   !session.loading &&
  //   session.invalidClaims.some(
  //     (i) => i.validatorId === EmailVerificationClaim.id
  //   );
  // if (loading || loadedNotAuth || emailNotVerified) {
  //   if (loadedNotAuth) router.push("/auth/loginsignup?from=sessionAuth");
  //   if (emailNotVerified)
  //     router.push("/auth/verify-email?rid=emailverification");
  //   return (
  //     <div className="max-h-screen-xl flex min-h-[70vh]">
  //       <div className="m-auto">
  //         <Spinner size="12" />
  //       </div>
  //     </div>
  //   );
  // }

  if (loading || loadedNotAuth) {
    if (loadedNotAuth) {
      router.push("/auth/loginsignup?from=sessionAuth");
    }
    return (
      <div className="max-h-screen-xl flex min-h-[70vh]">
        <div className="m-auto">
          <Spinner size="12" />
        </div>
      </div>
    );
  }

  return <STSessionAuth>{children}</STSessionAuth>;
}
