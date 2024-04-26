export default function Page({ params }: { params: { groupId: string } }) {
  return (
    <>
      <h1>Single Group Page</h1>
      <p>Group ID: {params.groupId}</p>
    </>
  );
}
