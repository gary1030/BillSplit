import GoogleSignInButton from "@/components/auth/googleSignInButton";
import Landing from "@/components/Landing";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Landing />
      <GoogleSignInButton></GoogleSignInButton>
    </div>
  );
}
