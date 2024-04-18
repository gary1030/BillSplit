"use client";
import { Button } from "@chakra-ui/react";
import { useAuth } from '@/hooks/useAuth';

interface GoogleSignInButtonProps {
  children: React.ReactNode;
}

const GoogleSignInButton = ({
  children,
}: GoogleSignInButtonProps) => {
  const { login } = useAuth(); 
  return <Button onClick={() => login()}>{children}</Button>; 
};

export default GoogleSignInButton;