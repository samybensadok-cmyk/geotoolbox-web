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
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variant === "default" &&
          "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300",
        variant === "outline" &&
          "border border-surface-border text-text-secondary",
        className
      )}
    >
      {children}
    </span>
  )
}
