import dynamic from "next/dynamic";
import useSessionLoading from "../../hooks/useSessionLoading";

const EmailVerificationNoSSR = dynamic(
  import("supertokens-auth-react/recipe/emailverification").then(
    (module) => module.EmailVerification
  ),
  {
    ssr: false,
  }
);

export default function Resetpassword() {
  const { loading, Loader } = useSessionLoading();
  if (loading) {
    return Loader;
  }
  return (
    <div className="flex min-h-[80vh]">
      <div className="m-auto">
        <EmailVerificationNoSSR />
      </div>
    </div>
  );
}
