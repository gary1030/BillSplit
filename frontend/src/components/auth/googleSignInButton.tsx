"use client";
import { Button, Image } from "@chakra-ui/react";
import { useAuth } from "@/hooks/useAuth";

interface GoogleSignInButtonProps {
  children: React.ReactNode;
}

const GoogleSignInButton = () => {
  const { login } = useAuth();
  return (
    <Button variant="unstyled" onClick={() => login()} padding="0">
      <Image src="/images/googleSignInButton.svg" alt="Continue with Google" />
    </Button>
  );
};

export default GoogleSignInButton;
