import Footer from "@/components/footer";
import Header from "@/components/header";

export default function UserPage() {
  return (
    <>
      <Header loggedIn={true} isGroup={false} />
      <h1>User Page</h1>
      <Footer />
    </>
  );
}
