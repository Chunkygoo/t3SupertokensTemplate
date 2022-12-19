import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { SignInAndUp } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import useSessionLoading from "../../hooks/useSessionLoading";

export default function Loginsignup() {
  const router = useRouter();
  const { loading, Loader } = useSessionLoading();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (router.query && router.query.from === "sessionAuth") {
        toast.info("Log in to continue", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [router.query]);
  if (loading) {
    return Loader;
  }
  return <SignInAndUp />;
}
