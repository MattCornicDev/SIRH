"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, ShieldAlert, CheckCircle } from "lucide-react";
import { Input } from "@components/ui/Input";
import { createClient } from "@/utils/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // 1. Validation côté client (UX rapide)
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      setIsLoading(false);
      return;
    }

    try {
      // 2. Appel à Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        // Optionnel : Vous pouvez passer des meta-données ici si besoin
        // options: { data: { role: 'admin' } }
      });

      if (signUpError) throw new Error(signUpError.message);

      // 3. Succès !
      setSuccess(true);

      // On attend un peu pour laisser l'utilisateur lire le message de succès
      setTimeout(() => {
        router.push("/directory");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      // Traduction des erreurs fréquentes de Supabase
      if (!err) return setError("Une erreur inconnue est survenue.");

      if (err.message.includes("User already registered")) {
        setError("Un compte existe déjà avec cette adresse email.");
      } else {
        setError("Une erreur est survenue lors de l'inscription.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* En-tête */}
        <div className="p-8 text-center border-b border-slate-100 bg-slate-50/50">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tighter mb-2">
            Team<span className="text-brand-500">Flow</span>.
          </div>
          <p className="text-sm text-slate-500">
            Créez votre espace administrateur RH
          </p>
        </div>

        <form onSubmit={handleRegister} className="p-8 space-y-5">
          {/* Bannière d'erreur */}
          {error && (
            <div className="p-3 bg-danger-50 border border-danger-200 text-danger-700 rounded-lg text-sm font-medium flex items-start gap-2 animate-in fade-in">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Bannière de succès */}
          {success && (
            <div className="p-3 bg-success-50 border border-success-200 text-success-700 rounded-lg text-sm font-medium flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <p>Compte créé avec succès ! Redirection...</p>
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
            disabled={isLoading || success}
          />

          <Input
            label="Mot de passe"
            type="password"
            icon={Lock}
            placeholder="Minimum 6 caractères"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading || success}
          />

          <Input
            label="Confirmer le mot de passe"
            type="password"
            icon={Lock}
            placeholder="Retapez votre mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading || success}
          />

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full mt-4 px-5 py-3 text-sm font-semibold text-white bg-brand-500 rounded-lg shadow-md hover:bg-brand-600 focus:ring-4 focus:ring-brand-500/30 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Création en cours...
              </>
            ) : success ? (
              "Bienvenue !"
            ) : (
              "Créer mon compte"
            )}
          </button>
        </form>

        {/* Footer (Redirection vers Login) */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 text-center flex flex-col gap-2">
          <p className="text-sm text-slate-500">Vous avez déjà un compte ?</p>
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 hover:text-brand-600 transition-colors inline-block"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
