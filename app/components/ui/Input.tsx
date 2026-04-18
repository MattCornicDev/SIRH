import React, { forwardRef } from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-slate-400" />
            </div>
          )}
          <input
            ref={ref}
            className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
              Icon ? "pl-10" : ""
            } ${error ? "border-danger-500 focus:ring-danger-500/20 focus:border-danger-500" : "border-slate-200"}`}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs font-medium text-danger-700">{error}</span>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
