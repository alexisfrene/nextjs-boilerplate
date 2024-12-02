"use client";

import { create } from "zustand";

interface FilterState {
  filter: string;
  page: number;
  size: number;
  setFilter: (newFilter: string) => void;
  setPage: (newPage: number) => void;
  setSize: (newSize: number) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  filter: "",
  page: 0,
  size: 20,
  setFilter: (newFilter) => set({ filter: newFilter }),
  setPage: (newPage) => set({ page: newPage }),
  setSize: (newSize) => set({ size: newSize }),
  reset: () => set({ filter: "", page: 0, size: 20 }),
}));
