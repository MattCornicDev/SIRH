"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Mail,
  Briefcase,
  Building2,
  Shield,
  Loader2,
} from "lucide-react";

import { Input } from "@components/ui/Input";
import { Select } from "@components/ui/Select";
import { createClient } from "@/utils/supabase/client"; // Your client-side Supabase utility
import { useUserStore } from "@/store/useUserStore";

// 1. Define the Validation Schema (Zod)
const employeeSchema = z.object({
  first_name: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Format d'email invalide"),
  job_title: z.string().min(2, "Veuillez renseigner le poste"),
  department: z.string().min(2, "Veuillez renseigner le département"),
  role: z.enum(["admin", "rh", "manager", "employé"]),
  status: z.enum(["actif", "en_pause", "offboarded"]),
  company_id: z.string(),
});

// Infer the TypeScript type from the schema
type EmployeeFormData = z.infer<typeof employeeSchema>;

export default function NewEmployeePage() {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const activeProfile = useUserStore((state) => state.activeProfile);

  // 2. Initialize the Form with Default Values for testing
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    // C'est cet objet que vous pouvez modifier pour vos tests :
    defaultValues: {
      first_name: "Alice",
      last_name: "Martin",
      email: "alice.martin@teamflow.com",
      job_title: "Développeuse Fullstack",
      department: "Ingénierie",
      role: "employé", // Doit correspondre à une "value" de vos options
      status: "actif",
      company_id: activeProfile?.company_id,
    },
  });

  // 3. Handle Form Submission to Supabase
  const onSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      if (!activeProfile?.company_id)
        throw new Error("Erreur de contexte d'entreprise");
      const { error } = await supabase.from("employees").insert([data]);

      if (error) {
        // Supabase error handling (e.g., unique email constraint)
        if (error.code === "23505") {
          setServerError("Un employé avec cet email existe déjà.");
        } else {
          setServerError("Une erreur est survenue lors de la création.");
        }
        return;
      }

      // Success! Redirect back to the directory
      router.push("/directory");
      router.refresh(); // Force Next.js to re-fetch the directory list
    } catch (err) {
      setServerError("Erreur de connexion au serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => router.back()}
            className="text-sm font-medium text-slate-500 hover:text-slate-900 mb-4 inline-flex items-center gap-2"
          >
            &larr; Retour à l&apos;annuaire
          </button>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Nouvel Employé
          </h1>
          <p className="text-slate-500 mt-1">
            Créez le dossier d&apos;un nouveau collaborateur.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            {/* Global Error Banner */}
            {serverError && (
              <div className="p-4 bg-danger-50 border border-danger-200 text-danger-700 rounded-lg text-sm font-medium flex items-start gap-3">
                <Shield className="w-5 h-5 shrink-0" />
                <p>{serverError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Prénom"
                icon={User}
                placeholder="Ex: Thomas"
                error={errors.first_name?.message}
                {...register("first_name")}
              />
              <Input
                label="Nom"
                icon={User}
                placeholder="Ex: Dubois"
                error={errors.last_name?.message}
                {...register("last_name")}
              />
            </div>

            <Input
              label="Email Professionnel"
              type="email"
              icon={Mail}
              placeholder="thomas@entreprise.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Poste"
                icon={Briefcase}
                placeholder="Ex: Développeur Front-end"
                error={errors.job_title?.message}
                {...register("job_title")}
              />
              <Input
                label="Département"
                icon={Building2}
                placeholder="Ex: Ingénierie"
                error={errors.department?.message}
                {...register("department")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <Select
                label="Niveau d'accès (Rôle)"
                icon={Shield}
                error={errors.role?.message}
                {...register("role")}
                options={[
                  { label: "Employé standard", value: "employé" },
                  { label: "Manager", value: "manager" },
                  { label: "Ressources Humaines", value: "rh" },
                  { label: "Administrateur", value: "admin" },
                ]}
              />
              <Select
                label="Statut actuel"
                error={errors.status?.message}
                {...register("status")}
                options={[
                  { label: "Actif", value: "actif" },
                  { label: "En pause", value: "en_pause" },
                  { label: "Désactivé", value: "offboarded" },
                ]}
              />
            </div>

            {/* Actions */}
            <div className="pt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-500 rounded-lg shadow-sm hover:bg-brand-600 focus:ring-4 focus:ring-brand-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Création en cours..." : "Créer le profil"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
