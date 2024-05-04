import { Box, Spinner } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      w="100vw"
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      backgroundColor="rgba(0, 0, 0, 0.2)"
      zIndex="9999"
    >
      <Spinner />
    </Box>
  );
}
