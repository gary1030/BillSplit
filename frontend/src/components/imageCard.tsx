import { Box, Image } from "@chakra-ui/react";

interface ImageCardProps {
  path: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function ImageCard({
  path,
  onClick,
  isSelected,
}: ImageCardProps) {
  return (
    <Box
      w="180px"
      h="120px"
      maxW="180px"
      borderWidth={isSelected ? "4px" : "2px"}
      borderRadius="lg"
      borderColor={isSelected ? "yellow.400" : "black"}
      overflow="hidden"
      onClick={onClick}
    >
      <Image src={path} alt="Theme" />
    </Box>
  );
}
