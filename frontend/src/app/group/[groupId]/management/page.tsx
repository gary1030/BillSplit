export default function GroupManagementPage({
  params,
}: {
  params: { groupId: string };
}) {
  return (
    <>
      <h1>Single Group Management Page</h1>
      <p>Group ID: {params.groupId}</p>
    </>
  );
}
