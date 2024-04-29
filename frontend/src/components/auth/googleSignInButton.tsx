"use client";
import { Button, Image } from "@chakra-ui/react";
import { useAuth } from "@/hooks/useAuth";

interface GoogleSignInButtonProps {
  children: React.ReactNode;
}

const GoogleSignInButton = () => {
  const { login } = useAuth();
  return (
    <Button
      variant="unstyled"
      onClick={() => login()}
      padding="0"
      position="relative"
      borderRadius="10px"
      overflow="hidden"
      _hover={{
        _after: {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          bg: "blackAlpha.200",
          borderRadius: "inherit",
        },
      }}
    >
      <Image
        src="/images/googleSignInButton.svg"
        alt="Continue with Google"
        fit="cover"
        align="center"
        w="full"
        h="full"
      />
    </Button>
  );
};

export default GoogleSignInButton;
