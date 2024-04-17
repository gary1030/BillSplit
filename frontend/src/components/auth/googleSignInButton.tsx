"use client";
import { Button } from "@chakra-ui/react";
import { useGoogleLogin } from "@react-oauth/google";

interface GoogleSignInButtonProps {
  children: React.ReactNode;
  callbackUrl: string;
}
const GoogleSignInButton = ({
  children,
  callbackUrl,
}: GoogleSignInButtonProps) => {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => console.log(codeResponse),
    flow: "auth-code",
  });

  return <Button onClick={() => login()}>{children}</Button>;
};

export default GoogleSignInButton;
