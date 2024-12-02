"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UserStore = {
  userData: {
    id: string;
    userName: string;
    userFile: string;
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    phone: string;
    roles: Array<{ id: string; description: string }>;
    customers: Array<{ id: string; name: string }>;
    avatar: string;
  } | null;
};

type Action = {
  setUserData: (data: UserStore["userData"] | null) => void;
};

export const userStore = create(
  persist<UserStore & Action>(
    (set) => ({
      userData: null,

      setUserData: (userData) => set({ userData }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default userStore;
