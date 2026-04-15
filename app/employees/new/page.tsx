"use client";

import { useFormState } from "react-dom";
import { addEmployee } from "./actions";

export default function NewEmployeePage() {
    const [state, formAction] = useFormState(addEmployee, { message: "", error: false});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input name="firstname" placeholder="Prénom" />
      <input name="lastname" placeholder="Nom" />
      <input name="email" placeholder="Email" />
      <input type="date" name="hire_date" />
      <button type="submit">Ajouter</button>

      {state.message && (
        <p className={state.error ? "texte-red-500" : "text-green-500"}>
            {state.message}
        </p>
      )}
    </form>
  );
}
