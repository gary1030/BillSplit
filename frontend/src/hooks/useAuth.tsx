import serverLogin from "@/actions/login";
import { useGoogleLogin } from "@react-oauth/google";

export const useAuth = (redirect_uri: string) => {
  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      await serverLogin(codeResponse.code, redirect_uri);
    },
    flow: "auth-code",
  });

  return { login };
};
