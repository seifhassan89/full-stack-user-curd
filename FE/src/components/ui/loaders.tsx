import React from "react";

interface LoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function FullPageLoader({ message = "Loading..." }: LoaderProps) {
  return (
    <div className="fullpage-loader">
      <div className="fullpage-loader__spinner"></div>
      <div className="fullpage-loader__text">{message}</div>
    </div>
  );
}

export function ComponentLoader({ message = "Loading...", size = "md" }: LoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  };

  return (
    <div className="component-loader">
      <div className={`component-loader__spinner ${sizeClasses[size]}`}></div>
      {message && <div className="component-loader__text">{message}</div>}
    </div>
  );
}

export function ButtonLoader({ size = "sm" }: { size?: "sm" | "md" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-5 h-5 border-2",
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-t-transparent border-primary ${sizeClasses[size]}`}></div>
  );
}