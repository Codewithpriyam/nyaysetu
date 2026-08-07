/**
 * NyayaSetu — Auth Store (Zustand)
 * Holds the authenticated user, their role, and Clerk sync state.
 */

import { create } from 'zustand';
import { setTokenProvider } from '@/services/api';

const useAuthStore = create((set, get) => ({
  // ─── State ────────────────────────────────────────────────────────────────
  user:        null,     // Clerk user object
  backendUser: null,     // Synced backend user record
  role:        null,     // 'USER' | 'LAWYER' | 'ADMIN' (from backend)
  isLoaded:    false,    // Clerk has resolved
  isSignedIn:  false,

  // ─── Actions ─────────────────────────────────────────────────────────────

  /** Called from ClerkWrapper once Clerk resolves */
  initializeAuth: (clerkUser, getToken, isSignedIn) => {
    // Register the token provider for the API client
    if (isSignedIn && getToken) {
      setTokenProvider(getToken);
    } else {
      setTokenProvider(null);
    }

    set({
      user:       clerkUser,
      isLoaded:   true,
      isSignedIn: isSignedIn,
    });
  },

  /** Set backend user + role (fetched from Spring Boot /api/auth/me) */
  setBackendUser: (backendUser) => {
    set({
      backendUser,
      role: backendUser?.role ?? null,
    });
  },

  /** Clear auth on sign-out */
  clearAuth: () => {
    setTokenProvider(null);
    set({ user: null, backendUser: null, role: null, isSignedIn: false });
  },

  // ─── Computed helpers ─────────────────────────────────────────────────────
  isUser:   () => get().role === 'USER',
  isLawyer: () => get().role === 'LAWYER',
  isAdmin:  () => get().role === 'ADMIN',
}));

export default useAuthStore;
