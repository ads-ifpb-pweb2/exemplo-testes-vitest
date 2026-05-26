import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
  variant?: ButtonVariant;
}

export function Button({ onClick, disabled, children, variant = "primary" }: Readonly<ButtonProps>) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`btn btn--${variant}`}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}
