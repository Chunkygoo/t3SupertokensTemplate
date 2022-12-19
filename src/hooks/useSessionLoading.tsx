import { useSessionContext } from "supertokens-auth-react/recipe/session";
import Spinner from "../components/Common/Spinner";

export default function useSessionLoading() {
  const session = useSessionContext();
  const loading = session.loading;
  // takes care of the case where the user manually types /auth/loginsignup in the browser
  const Loader = (
    <div className="max-h-screen-xl flex min-h-[70vh]">
      <div className="m-auto">
        <Spinner size="12" />
      </div>
    </div>
  );
  return { loading, Loader, session };
}
