import { cn } from "@/utils/cn"

interface ThemeButtonProps {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}

export function ThemeButton({ active, onClick, icon, label }: ThemeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md border text-sm transition-colors cursor-pointer",
        active
          ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
          : "border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--accent)]"
      )}
    >
      {icon}
      {label}
    </button>
  )
}
