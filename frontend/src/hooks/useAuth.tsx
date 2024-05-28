import serverLogin from "@/actions/login";
import { useToast } from "@chakra-ui/react";
import { useGoogleLogin } from "@react-oauth/google";

export const useAuth = (redirect_uri: string) => {
  const toast = useToast();
  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      await serverLogin(codeResponse.code, redirect_uri);
    },
    onError: (error) => {
      toast({
        title: "Failed to login",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
    flow: "auth-code",
  });

  return { login };
};
