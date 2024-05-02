import { Text, Center } from '@chakra-ui/react';

interface GroupTitleProps {
  title: string;
  onEdit?: () => void;
}

export default function GroupTitle({ title, onEdit }: GroupTitleProps) {
  return (
    <Center>
      <Text fontSize={{base: "2xl", md:"3xl"}} as="b">{title}</Text>
    </Center>
  );
}
