import { cn } from "@/lib/utils"

type BadgeProps = {
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline"
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-medium tracking-wider uppercase",
        variant === "default" && "text-accent-600",
        variant === "outline" && "text-slate-500",
        className
      )}
    >
      {children}
    </span>
  )
}
