import { create } from 'zustand';
import { User } from '@/types';

interface AuthStoreInterface {
  authenticated: boolean; // a boolean value indicating whether the user is authenticated or not
  setAuthentication: (val: boolean) => void; // a function to set the authentication status
  user: User | null; // an object that stores user information
  setUser: (user: User) => void; // a function to set user information
  token: string;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthStoreInterface>((set) => ({
  authenticated: false,
  user: null,
  token: '',
  setAuthentication: (val) => set((state) => ({ authenticated: val })),
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
}));
