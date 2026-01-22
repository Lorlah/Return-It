"use client";

import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
}

const variantStyles = {
  default: "bg-white border border-border",
  elevated: "bg-white shadow-md",
  outlined: "bg-transparent border border-border-strong",
};

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  variant = "default",
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  return (
    <motion.div
      className={`
        rounded-2xl
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
