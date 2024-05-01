import { Box, Spinner } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Box
      w="100%"
      h="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Spinner />
    </Box>
  );
}
