"use client";
import { useAuth } from "@/hooks/useAuth";
import { Button, Center, Text } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

interface GoogleSignInButtonProps {
  children: React.ReactNode;
}

const GoogleSignInButton = () => {
  const params = useParams<{ redirect_uri: string }>();
  const redirect_uri = params.redirect_uri;
  const { login } = useAuth(redirect_uri || "/user");
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
      border={"2px solid"}
      borderRadius={"full"}
      _hover={{
        bg: "gray.100",
        transform: "scale(1.03)",
        transition: "all 0.1s",
      }}
    >
      <Center>
        <Text>Continue with Google</Text>
      </Center>
    </Button>
  );
};

export default GoogleSignInButton;
