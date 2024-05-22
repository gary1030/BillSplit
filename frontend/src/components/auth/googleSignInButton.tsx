"use client";
import { useAuth } from "@/hooks/useAuth";
import { Button, Center, Text } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";

interface GoogleSignInButtonProps {
  children: React.ReactNode;
}

const GoogleSignInButton = () => {
  const params = new URLSearchParams(window.location.search);
  const redirect_uri = params.get("redirect_uri");
  const { login } = useAuth(redirect_uri || "/group");
  return (
    <Button
      w={"full"}
      maxW={"md"}
      variant={"outline"}
      leftIcon={<FcGoogle />}
      onClick={() => login()}
      width={"300px"}
      height={"50px"}
      marginTop={"30px"}
    >
      <Center>
        <Text>Continue with Google</Text>
      </Center>
    </Button>
  );
};

export default GoogleSignInButton;
