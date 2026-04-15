"use server";

import { createClient } from "@/utils/supabase/server";

export async function addEmployee(prevState: { message: string; error: boolean}, formData: FormData) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("employees")
    .insert({
      firstname: formData.get("firstname"),
      lastname: formData.get("lastname"),
      email: formData.get("email"),
      hire_date: formData.get("hire_date"),
      status: "active"
    });

    if (error) {
        return { message: `Erreur : ${error.message}`, error:true };
    }

  return { message: "Employé ajouté avec succès", error:false };
}
