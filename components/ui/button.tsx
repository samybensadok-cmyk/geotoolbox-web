import { cn } from "@/lib/utils"
import Link from "next/link"

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  href?: string
  className?: string
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const variants = {
  primary: "bg-slate-900 text-cream hover:bg-slate-800",
  secondary: "border border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900",
  ghost: "text-slate-500 underline underline-offset-4 decoration-slate-300 hover:text-slate-900 hover:decoration-slate-500",
}

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-sm",
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
    "inline-flex items-center justify-center font-medium transition-colors cursor-pointer",
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
