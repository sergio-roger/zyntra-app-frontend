import React from "react";

interface CardWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "highlighted" | "interactive";
  hoverable?: boolean;
  className?: string;
}

export const CardWrapper: React.FC<CardWrapperProps> = ({
  children,
  variant = "default",
  hoverable = true,
  className = "",
  ...props
}) => {
  const baseClasses =
    "relative flex flex-col justify-between rounded-lg border transition-all duration-300";

  const variantClasses = {
    default: "bg-slate-900/50 border-white/5 shadow-xl text-white",
    highlighted:
      "border-primary ring-2 ring-primary/20 scale-[1.01] shadow-2xl bg-slate-900/80 text-white",
    interactive: "bg-base-200 border-base-300 text-base-content",
  };

  const hoverClasses =
    hoverable && variant !== "highlighted"
      ? "hover:border-white/10 hover:shadow-xl hover:-translate-y-0.5"
      : "";

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
