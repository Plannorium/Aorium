import React from "react";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded font-medium transition-all duration-300 relative overflow-hidden";

  const variantStyles = {
    primary:
      "bg-[#D4AF37] text-primary-dark hover:bg-gold/90 hover:shadow-lg hover:shadow-gold/20 active:scale-95",
    secondary:
      "bg-secondary text-white hover:bg-secondary/90 hover:shadow-lg hover:shadow-secondary/20 active:scale-95",
    outline:
      "bg-transparent border border-gold text-[#D4AF37] hover:bg-gold/10 hover:shadow-lg hover:shadow-gold/10 active:scale-95",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5",
    lg: "px-7 py-3.5 text-lg",
  };

  const disabledStyles = disabled
    ? "opacity-60 cursor-not-allowed hover:shadow-none active:scale-100"
    : "";

  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        <span className="relative z-10 flex items-center">{children}</span>
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={styles}
      disabled={disabled}
    >
      <span className="relative z-10 flex items-center">{children}</span>
    </button>
  );
};

export default Button;
