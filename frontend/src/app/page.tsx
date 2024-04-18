'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import GoogleSignInButton from "@/components/auth/googleSignInButton";

export default function Home() {
  const { authenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (authenticated) {
      router.push('/user');
    }
  }, [authenticated, router]);

  return (
    <div>
      <h1>Home</h1>
      <GoogleSignInButton>
        Sign in with Google
      </GoogleSignInButton>
    </div>
  );
}