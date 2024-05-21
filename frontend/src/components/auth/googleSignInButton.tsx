"use client";
import { useAuth } from "@/hooks/useAuth";
import { Button, Image, Center, Text } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";

interface GoogleSignInButtonProps {
  children: React.ReactNode;
}

const GoogleSignInButton = () => {
  const { login } = useAuth();
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
        <Text>Sign in with Google</Text>
      </Center>
    </Button>
  );
};

export default GoogleSignInButton;
