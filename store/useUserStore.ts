import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { EmployeeProfile } from "@/types";
import { createClient } from "@/utils/supabase/client";

interface UserState {
  user: User | null;
  activeProfile: EmployeeProfile | null;
  isLoading: boolean;
  lastFetched: number | null;

  // Fonction pour injecter manuellement la donnée (ex: juste après le Login)
  setAuthData: (user: User | null, profile: EmployeeProfile | null) => void;

  // Fonction asynchrone intelligente (avec cache)
  fetchUser: (forceRefresh?: boolean) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  activeProfile: null,
  isLoading: false,
  lastFetched: null,

  // Pratique si vous venez de faire un signUp/signIn et que vous avez DÉJÀ la donnée
  setAuthData: (user, activeProfile) =>
    set({ user, activeProfile, lastFetched: Date.now() }),

  fetchUser: async (forceRefresh = false) => {
    const { user, activeProfile, lastFetched } = get();
    const now = Date.now();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes de cache

    // 1. VÉRIFICATION DU CACHE : On bloque l'appel si on a déjà les données et qu'elles sont récentes
    if (
      !forceRefresh &&
      user &&
      activeProfile &&
      lastFetched &&
      now - lastFetched < CACHE_DURATION
    ) {
      return;
    }

    // 2. APPEL API (Supabase)
    set({ isLoading: true });
    const supabase = createClient();

    try {
      // A. On récupère la session Auth
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        // L'utilisateur n'est pas connecté
        set({
          user: null,
          activeProfile: null,
          isLoading: false,
          lastFetched: now,
        });
        return;
      }

      // B. On récupère le profil de l'employé associé
      const { data: profileData, error: profileError } = await supabase
        .from("employees")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

      if (profileError) {
        console.error("Erreur de récupération du profil:", profileError);
        // On a le user Auth, mais pas son profil BDD (ex: inscription pas encore terminée)
        set({
          user: authUser,
          activeProfile: null,
          isLoading: false,
          lastFetched: now,
        });
        return;
      }

      // C. Succès total ! On sauvegarde tout dans le store.
      set({
        user: authUser,
        activeProfile: profileData as EmployeeProfile,
        isLoading: false,
        lastFetched: now,
      });

      console.log(profileData);
    } catch (error) {
      console.error("Erreur inattendue dans fetchUser:", error);
      set({ isLoading: false });
    }
  },
}));
