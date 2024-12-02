"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionState {
  token: string | null;
  setToken: (newToken: string | null) => void;
  clearToken: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (newToken) => set({ token: newToken }),
      clearToken: () => set({ token: null }),
    }),
    { name: "session-token" }
  )
);
