import GoogleSignInButton from "@/components/auth/googleSignInButton";
export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <GoogleSignInButton callbackUrl="/user">
        Sign in with Google
      </GoogleSignInButton>
    </div>
  );
}
