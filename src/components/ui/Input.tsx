import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, disabled, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm mb-1 text-gray-600">{label}</label>
      )}
      <input
        {...props}
        disabled={disabled}
        type={props.type || "text"}
        className={`w-full bg-white border rounded-lg px-3 py-2 text-sm 
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} 
          ${error ? "border-red-500" : "border-gray-300"}
        `}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
