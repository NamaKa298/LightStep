import { create } from "zustand";

type AuthDrawerState = {
  open: boolean;
  mode: "login" | "signup";
  setOpen: (open: boolean) => void;
  setMode: (mode: "login" | "signup") => void;
};

export const useAuthDrawerStore = create<AuthDrawerState>((set) => ({
  open: false,
  mode: "login",
  setOpen: (open) => set({ open }),
  setMode: (mode) => set({ mode }),
}));
