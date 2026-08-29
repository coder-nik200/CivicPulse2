"use client";

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

// Button Component
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-teal-600 text-white hover:bg-teal-700 focus-visible:ring-teal-500",
        secondary:
          "bg-slate-200 text-slate-900 hover:bg-slate-300 focus-visible:ring-slate-400",
        outline:
          "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 focus-visible:ring-slate-500",
        ghost: "text-slate-600 hover:bg-slate-50 focus-visible:ring-slate-400",
        danger:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={buttonVariants({ variant, size, className: className })}
      {...props}
    />
  ),
);
Button.displayName = "Button";

// Input Component
const inputVariants = cva(
  "flex w-full rounded-lg border bg-white px-4 py-2.5 text-base transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
  {
    variants: {
      variant: {
        default:
          "border-slate-200 focus-visible:border-teal-500 focus-visible:ring-teal-500",
        error:
          "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface InputProps
  extends
    React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, ...props }, ref) => (
    <input
      ref={ref}
      className={inputVariants({ variant, className })}
      {...props}
    />
  ),
);
Input.displayName = "Input";

// Label Component
export const Label = forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ""}`}
    {...props}
  />
));
Label.displayName = "Label";

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={`flex min-h-[100px] w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-base transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${className || ""}`}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

// Select Component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={`flex h-10 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${className || ""}`}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";
