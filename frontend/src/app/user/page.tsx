import Header from "@/components/header";
import Footer from "@/components/footer";

export default function UserPage() {
  return (
    <>
      <Header loggedIn={true} isgroup={false} />
      <h1>User Page</h1>
      <Footer />
    </>
  );
}
