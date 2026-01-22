"use client";

import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-body-sm font-medium text-text-primary mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 rounded-xl border bg-white
            text-text-primary placeholder:text-text-muted
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            ${error ? "border-error" : "border-border"}
            ${className}
          `}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-2 text-body-sm text-error">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-2 text-body-sm text-text-muted">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
