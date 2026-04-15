import { create } from "zustand";
import { User } from "@supabase/supabase-js"; // Le type officiel de Supabase
import { EmployeeProfile } from "@/types"; // Nos propres types

// Fini les "any", on sait exactement ce que contient le store !
interface UserState {
  user: User | null;
  activeProfile: EmployeeProfile | null;
  setAuthData: (user: User | null, profile: EmployeeProfile | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  activeProfile: null,
  setAuthData: (user, activeProfile) => set({ user, activeProfile }),
}));
