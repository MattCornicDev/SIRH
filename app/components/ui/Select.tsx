import React, { forwardRef, useState, useRef, useEffect } from "react";
import { LucideIcon, ChevronDown, Check } from "lucide-react";

interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> {
  label: string;
  options: { label: string; value: string }[];
  error?: string;
  icon?: LucideIcon;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      icon: Icon,
      className = "",
      defaultValue = "",
      ...props
    },
    forwardedRef,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(defaultValue);

    // Références pour gérer le clic à l'extérieur et le sélecteur caché
    const containerRef = useRef<HTMLDivElement>(null);
    const hiddenSelectRef = useRef<HTMLSelectElement>(null);

    // Fusion des références (pour que React Hook Form et notre composant puissent tous deux accéder au select caché)
    const setRefs = (element: HTMLSelectElement) => {
      hiddenSelectRef.current = element;
      if (typeof forwardedRef === "function") {
        forwardedRef(element);
      } else if (forwardedRef) {
        forwardedRef.current = element;
      }
    };

    // Fermer le menu si on clique en dehors du composant
    useEffect(() => {
      const handleOutsideClick = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleOutsideClick);
      return () =>
        document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    // Gérer la sélection d'une option
    const handleSelect = (value: string) => {
      setSelectedValue(value);
      setIsOpen(false);

      // Simuler un événement 'change' natif pour que React Hook Form capte la nouvelle valeur
      if (hiddenSelectRef.current) {
        hiddenSelectRef.current.value = value;
        hiddenSelectRef.current.dispatchEvent(
          new Event("change", { bubbles: true }),
        );
      }
    };

    // Trouver le label de l'option actuellement sélectionnée
    const selectedOption = options.find((opt) => opt.value === selectedValue);

    return (
      <div className="w-full flex flex-col gap-1.5" ref={containerRef}>
        <label className="text-sm font-semibold text-slate-700">{label}</label>

        <div className="relative">
          {/* L'UI CUSTOM (Ce que l'utilisateur voit et clique) */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between rounded-lg border bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
            ${Icon ? "pl-10" : ""} 
            ${error ? "border-danger-500 focus:ring-danger-500/20 focus:border-danger-500" : "border-slate-200"} 
            ${className}`}
          >
            {/* Icône de contexte optionnelle */}
            {Icon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-slate-400" />
              </div>
            )}

            {/* Texte affiché */}
            <span
              className={!selectedOption ? "text-slate-400" : "text-slate-900"}
            >
              {selectedOption ? selectedOption.label : "Sélectionner..."}
            </span>

            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* LE MENU DÉROULANT CUSTOM */}
          {isOpen && (
            <div className="absolute z-50 mt-1 w-full rounded-lg border border-slate-100 bg-white shadow-lg ring-1 ring-black/5 py-1 animate-in fade-in slide-in-from-top-2">
              <ul className="max-h-60 overflow-auto">
                {options.map((opt) => (
                  <li
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`flex items-center justify-between px-4 py-2 text-sm cursor-pointer transition-colors
                      ${selectedValue === opt.value ? "bg-brand-50 text-brand-700 font-medium" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"}`}
                  >
                    {opt.label}
                    {selectedValue === opt.value && (
                      <Check className="h-4 w-4 text-brand-600" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* LE SÉLECTEUR NATIF CACHÉ (Pour React Hook Form) */}
          <select
            ref={setRefs}
            className="sr-only" // sr-only cache l'élément visuellement mais le garde dans le DOM
            defaultValue={defaultValue}
            aria-hidden="true"
            tabIndex={-1}
            {...props}
          >
            <option value="" disabled>
              Sélectionner...
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Message d'erreur */}
        {error && (
          <span className="text-xs font-medium text-danger-700 animate-in fade-in slide-in-from-top-1">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
