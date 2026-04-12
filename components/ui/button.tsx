import { cn } from "@/lib/utils"
import Link from "next/link"

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "outline"
  size?: "sm" | "md" | "lg"
  href?: string
  className?: string
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const variants = {
  primary:
    "bg-brand-500 hover:bg-brand-600 text-white shadow-sm hover:shadow-brand-500/25",
  secondary:
    "bg-surface-secondary hover:bg-surface-tertiary text-text-primary border border-surface-border",
  ghost: "text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950",
  outline:
    "border border-surface-border text-text-primary hover:border-brand-300 hover:text-brand-600",
}

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 cursor-pointer",
    variants[variant],
    sizes[size],
    className
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
