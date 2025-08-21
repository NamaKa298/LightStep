import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/User";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAuth: (accessToken: string, user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      accessToken: null,
      user: null,
      setAuth: (accessToken, user) => set({ accessToken, user }),
      clearAuth: () => set({ accessToken: null, user: null }),
      // Sélecteurs dérivés (calculés)
      isAuthenticated: () => !!get().accessToken,
      userRole: () => get().user?.role || null,
    }),
    { name: "auth-storage" } //nom pour le localStorage
  )
);
