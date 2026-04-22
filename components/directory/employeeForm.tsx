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

import { Input } from "@/components/ui/Input"; // Vérifiez bien ce chemin d'import
import { Select } from "@/components/ui/Select"; // Vérifiez bien ce chemin d'import
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/store/useUserStore";
import { Employee } from "@/types";

// 1. Le schéma Zod (sans le company_id, car c'est le système qui le gère en coulisses)
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
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  initialData?: Employee; // Les données venant de Supabase si on édite
  isEditing?: boolean;
}

export function EmployeeForm({
  initialData,
  isEditing = false,
}: EmployeeFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const activeProfile = useUserStore((state) => state.activeProfile);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // 2. Initialisation intelligente avec vos valeurs par défaut OU les données existantes
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData || {
      first_name: "",
      last_name: "",
      email: "",
      job_title: "",
      department: "",
      role: "employé",
      status: "actif",
    },
  });

  // 3. Soumission (Gère Création ET Édition)
  const onSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      console.log(activeProfile);

      if (!activeProfile?.company_id)
        throw new Error("Erreur de contexte d'entreprise");

      let error;

      if (isEditing && initialData) {
        // --- MODE ÉDITION ---
        const { error: updateError } = await supabase
          .from("employees")
          .update(data)
          .eq("id", initialData.id);
        error = updateError;
      } else {
        // --- MODE CRÉATION ---
        const { error: insertError } = await supabase
          .from("employees")
          .insert([{ ...data, company_id: activeProfile.company_id }]);
        error = insertError;
      }

      if (error) {
        if (error.code === "23505") {
          setServerError("Un employé avec cet email existe déjà.");
        } else {
          setServerError("Une erreur est survenue lors de l'enregistrement.");
        }
        return;
      }

      router.push("/directory");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError("Erreur de connexion au serveur.");
        console.error("EmployeeForm error:", err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
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
            defaultValue={initialData?.role || "employé"}
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
            defaultValue={initialData?.status || "actif"}
            options={[
              { label: "Actif", value: "actif" },
              { label: "En pause", value: "en_pause" },
              { label: "Désactivé", value: "offboarded" },
            ]}
          />
        </div>

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
            {isSubmitting
              ? "Enregistrement..."
              : isEditing
                ? "Sauvegarder"
                : "Créer le profil"}
          </button>
        </div>
      </form>
    </div>
  );
}
