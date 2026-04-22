"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Loader2,
  ShieldAlert,
  CheckCircle,
  Building,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/utils/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  // --- NOUVEAUX ÉTATS POUR LE MULTI-TENANT ---
  const [firstName, setFirstName] = useState("Jean");
  const [lastName, setLastName] = useState("Dupont");
  const [companyName, setCompanyName] = useState("RH Humanitech");

  // --- ÉTATS D'AUTHENTIFICATION ---
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
      // 1. ÉTAPE AUTH : Création du compte de connexion
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw new Error(signUpError.message);

      // 2. ÉTAPE DATABASE : Création de l'entreprise et du profil
      // On utilise la fonction RPC créée dans la base de données
      const { error: dbError } = await supabase.rpc("create_new_tenant", {
        company_name: companyName,
        admin_first_name: firstName,
        admin_last_name: lastName,
        admin_job_title: "Administrateur RH", // On force ce titre par défaut pour le créateur
        admin_email: email,
      });

      if (dbError) throw new Error(dbError.message);

      // 3. SUCCÈS
      setSuccess(true);
      setTimeout(() => {
        router.push("/directory");
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      if (err instanceof Error)
        setError(err.message || "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden my-8">
        {/* En-tête */}
        <div className="p-8 text-center border-b border-slate-100 bg-slate-50/50">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tighter mb-2">
            Team<span className="text-brand-500">Flow</span>.
          </div>
          <p className="text-sm text-slate-500">
            Créez l&apos;espace de travail de votre entreprise
          </p>
        </div>

        <form onSubmit={handleRegister} className="p-8 space-y-5">
          {error && (
            <div className="p-3 bg-danger-50 border border-danger-200 text-danger-700 rounded-lg text-sm font-medium flex items-start gap-2">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-success-50 border border-success-200 text-success-700 rounded-lg text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <p>Espace créé avec succès ! Redirection...</p>
            </div>
          )}

          {/* --- SECTION ENTREPRISE --- */}
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
              1. Votre Entreprise
            </h3>
            <Input
              label="Nom de l'entreprise"
              type="text"
              icon={Building}
              placeholder="Ex: TechCorp"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              disabled={isLoading || success}
            />
          </div>

          {/* --- SECTION PROFIL ADMIN --- */}
          <div className="pb-4 border-b border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
              2. Votre Profil
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                type="text"
                icon={User}
                placeholder="Jean"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={isLoading || success}
              />
              <Input
                label="Nom"
                type="text"
                placeholder="Dupont"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={isLoading || success}
              />
            </div>
          </div>

          {/* --- SECTION IDENTIFIANTS --- */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
              3. Connexion
            </h3>
            <Input
              label="Email professionnel"
              type="email"
              icon={Mail}
              placeholder="jean@techcorp.com"
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
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full mt-6 px-5 py-3 text-sm font-semibold text-white bg-brand-500 rounded-lg shadow-md hover:bg-brand-600 focus:ring-4 focus:ring-brand-500/30 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Création en
                cours...
              </>
            ) : success ? (
              "Bienvenue !"
            ) : (
              "Créer mon espace de travail"
            )}
          </button>
        </form>

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
