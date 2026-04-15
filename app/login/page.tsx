"use client";

import React, { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Mail, Lock, Loader2, ShieldAlert } from "lucide-react";
import { Input } from "@components/ui/Input";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // --- LOGIQUE DE CONNEXION ---
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw new Error("Identifiants incorrects.");
      } else {
        // --- LOGIQUE D'INSCRIPTION ---
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw new Error(signUpError.message);
      }

      // Si tout s'est bien passé, on redirige vers l'annuaire !
      router.push("/directory");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* En-tête design */}
        <div className="p-8 text-center border-b border-slate-100 bg-slate-50/50">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tighter mb-2">
            Team<span className="text-brand-500">Flow</span>.
          </div>
          <p className="text-sm text-slate-500">
            {isLogin
              ? "Connectez-vous à votre espace RH"
              : "Créez votre compte administrateur"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="p-8 space-y-5">
          {/* Bannière d'erreur */}
          {error && (
            <div className="p-3 bg-danger-50 border border-danger-200 text-danger-700 rounded-lg text-sm font-medium flex items-center gap-2 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <Input
            label="Adresse Email"
            type="email"
            icon={Mail}
            placeholder="vous@entreprise.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Mot de passe"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 px-5 py-3 text-sm font-semibold text-white bg-brand-500 rounded-lg shadow-md hover:bg-brand-600 focus:ring-4 focus:ring-brand-500/30 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLogin ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 text-center">
          <p className="text-sm text-slate-500">
            {isLogin
              ? "Vous n'avez pas de compte ?"
              : "Vous avez déjà un compte ?"}
            <button
              onClick={() => {
                redirect("/register");
              }}
              className="ml-2 font-semibold text-brand-600 hover:text-brand-800 transition-colors"
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
