"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import theme from "./globalTheme";

export function Providers({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </GoogleOAuthProvider>
  );
}
