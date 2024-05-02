import Header from '@/components/header';
import ImageCard from '@/components/imageCard';
import { Container } from '@chakra-ui/react';
import GroupManagement from './groupManagement';

export default function GroupManagementPage({
  params,
}: {
  params: { groupId: string };
}) {
  return (
    <>
      <Header loggedIn={true} isgroup={true} />
      <Container
        w={{ base: '90%', md: '80%' }}
        maxW="800px"
        mt="40px"
        mb="30px"
      >
        <ImageCard width="100%" height="30vh" path="/images/mountain.jpg" />
        <GroupManagement groupId={params.groupId} />
      </Container>
    </>
  );
}
