import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';
import { setTokenProvider } from '../services/apiClient';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      initialized: false,
      async login(email, password) {
        const { token, user } = await authService.login(email, password);
        set({ token, user });
        return user;
      },
      async loadMe() {
        try {
          const me = await authService.me();
          set({ user: me.user, initialized: true });
        } catch {
          set({ user: null, token: null, initialized: true });
        }
      },
      async logout() {
        try {
          await authService.logout();
        } catch {
          // ignore
        }
        set({ user: null, token: null });
      },
      setToken(t) {
        set({ token: t });
      },
    }),
    {
      name: 'auth-store',
      partialize: (s) => ({ token: s.token, user: s.user }),
    }
  )
);

setTokenProvider(() => useAuthStore.getState().token);