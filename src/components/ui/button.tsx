"use client"

import React, { ButtonHTMLAttributes } from "react"
import { cn } from "@/utils/cn"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "outline"
    | "ghost"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className,
  isLoading,
  disabled,
  leftIcon,
  rightIcon,
  ...props
}) => {
  // Base styles
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-4 py-2 text-sm rounded-md",
    lg: "px-5 py-2.5 text-base rounded-lg",
  }

  // Variant styles
  const variantStyles = {
    primary:
      "bg-primary hover:bg-primary-600 text-white focus:ring-primary-500",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
    success:
      "bg-success hover:bg-success-600 text-white focus:ring-success-500",
    danger: "bg-danger hover:bg-danger-600 text-white focus:ring-danger-500",
    warning:
      "bg-warning hover:bg-warning-600 text-white focus:ring-warning-500",
    outline:
      "border border-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500",
    ghost:
      "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500",
  }

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        isLoading && "opacity-70 cursor-not-allowed",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}

      {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}

      {children}

      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  )
}
