import { create } from "zustand";

export const usePortalStore = create((set) => ({
  insidePortal: false,
  enterPortal: () => set({ insidePortal: true }),
  exitPortal: () => set({ insidePortal: false }),
}));