import dynamic from "next/dynamic";
import useSessionLoading from "../../hooks/useSessionLoading";

const ResetPasswordUsingTokenNoSSR = dynamic(
  import("supertokens-auth-react/recipe/thirdpartyemailpassword").then(
    (module) => module.ResetPasswordUsingToken
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
        <ResetPasswordUsingTokenNoSSR />
      </div>
    </div>
  );
}
