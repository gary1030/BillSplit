import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/stores/useAuthStore';
import { User } from '@/types';
import httpAgent from '@/agent/httpAgent';

export const useAuth = () => {
  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const data: User = await httpAgent('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: codeResponse.code }),
        });
        useAuthStore.setState({ user: data, token: data.token, authenticated: true });
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', data.token);
      } catch (error) {
        console.error(error);
      }
    },
    flow: "auth-code",
  });

  return { login };
};