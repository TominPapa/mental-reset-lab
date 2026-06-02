import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}) {
  const max =
    size === "narrow"
      ? "max-w-2xl"
      : size === "wide"
        ? "max-w-6xl"
        : "max-w-4xl";
  return (
    <div className={`mx-auto w-full ${max} px-5 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}
