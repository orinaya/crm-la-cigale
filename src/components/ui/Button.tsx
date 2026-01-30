import React from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: 'bg-lacigale-gold text-white hover:bg-yellow-600',
      secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
      danger: 'bg-red-500 text-white hover:bg-red-600'
    };

    return (
      <button
        ref={ref}
        className={cn(
          "px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
