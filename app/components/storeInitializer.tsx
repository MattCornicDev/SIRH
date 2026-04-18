"use client";

import { useRef } from "react";
import { useUserStore } from "@/store/useUserStore";
import { User } from "@supabase/supabase-js";
import { EmployeeProfile } from "@/types";

export default function StoreInitializer({
  user,
  activeProfile,
}: {
  user: User;
  activeProfile: EmployeeProfile;
}) {
  // On utilise useRef pour s'assurer que l'injection ne se fait qu'UNE SEULE FOIS au chargement
  const initialized = useRef(false);

  if (!initialized.current) {
    useUserStore.setState({ user, activeProfile });
    initialized.current = true;
  }

  // Ce composant est invisible, il ne renvoie rien à l'écran !
  return null;
}
