import { create } from "zustand";

type AuthDrawerState = {
  open: boolean; // etat stocké 1 : open oui ou non
  mode: "login" | "signup"; //etat stocké 2 : mode login OU sign up
  setOpen: (open: boolean) => void; //action 1 : ouvre ou ferme le drawer
  setMode: (mode: "login" | "signup") => void; //action 2 : change le mode entre login et sign up
};

export const useAuthDrawerStore = create<AuthDrawerState>((set) => ({
  open: false,
  mode: "login",
  setOpen: (open) => set({ open }),
  setMode: (mode) => set({ mode }),
}));
