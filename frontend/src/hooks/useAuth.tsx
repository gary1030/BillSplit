import serverLogin from "@/actions/login";
import { useGoogleLogin } from "@react-oauth/google";

export const useAuth = () => {
  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      await serverLogin(codeResponse.code);
    },
    flow: "auth-code",
  });

  return { login };
};
