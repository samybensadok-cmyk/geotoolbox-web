import { cn } from "@/lib/utils"

const icons: Record<string, string> = {
  info: "ℹ️",
  warning: "⚠️",
  tip: "💡",
  danger: "🚨",
}

const styles: Record<string, string> = {
  info: "border-blue-400 bg-blue-50 dark:bg-blue-950/30",
  warning: "border-amber-400 bg-amber-50 dark:bg-amber-950/30",
  tip: "border-green-400 bg-green-50 dark:bg-green-950/30",
  danger: "border-red-400 bg-red-50 dark:bg-red-950/30",
}

type CalloutProps = {
  type?: "info" | "warning" | "tip" | "danger"
  title?: string
  children: React.ReactNode
}

export function Callout({ type = "info", title, children }: CalloutProps) {
  return (
    <div
      className={cn(
        "my-6 rounded-lg border-l-4 p-4 not-prose",
        styles[type]
      )}
    >
      <div className="flex gap-2">
        <span className="text-lg">{icons[type]}</span>
        <div>
          {title && (
            <p className="mb-1 font-semibold text-text-primary">{title}</p>
          )}
          <div className="text-sm text-text-secondary leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
