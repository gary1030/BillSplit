import { Box, Image } from "@chakra-ui/react";

interface ImageCardProps {
  path: string;
  isSelected?: boolean;
  width?: string;
  height?: string;
  onClick?: () => void;
}

export default function ImageCard({
  path,
  onClick,
  width,
  height,
  isSelected,
}: ImageCardProps) {
  return (
    <Box
      w={width || "180px"}
      h={height || "120px"}
      borderWidth={isSelected ? "4px" : "2px"}
      borderRadius="lg"
      borderColor={isSelected ? "yellow.400" : "black"}
      overflow="hidden"
      onClick={onClick}
    >
      <Image src={path} w="100%" h="100%" objectFit="cover" alt="Theme" />
    </Box>
  );
}
