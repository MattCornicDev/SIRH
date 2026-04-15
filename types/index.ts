// types/index.ts

// 1. Les types stricts pour vos menus déroulants (Assure qu'on ne fait pas de faute de frappe)
export type EmployeeRole = "admin" | "rh" | "manager" | "employé";
export type EmployeeStatus = "actif" | "en_pause" | "offboarded";

// 2. L'interface de l'Entreprise
export interface Company {
  id: string;
  name: string;
  created_at?: string;
}

// 3. L'interface de base de l'Employé (Tel qu'il est dans la table)
export interface Employee {
  id: string;
  user_id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  email: string;
  job_title: string | null;
  department: string | null;
  role: EmployeeRole;
  status: EmployeeStatus;
  start_date: string | null;
  created_at?: string;
}

// 4. L'interface "Étendu" : Ce que le Layout récupère avec la jointure SQL
export interface EmployeeProfile extends Employee {
  companies: {
    name: string;
  } | null;
}
