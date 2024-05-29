import serverLogin from "@/actions/login";
import { useToast } from "@chakra-ui/react";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useAuth = (redirect_uri: string) => {
  const toast = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      await serverLogin(codeResponse.code);
      setIsLoading(false);
      router.push(redirect_uri);
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

  return { login, isLoading, setIsLoading };
};
