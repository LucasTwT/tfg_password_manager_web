import { Globe } from "lucide-react"
import { cn } from "@/utils/cn"

interface LangButtonProps {
  active: boolean
  onClick: () => void
  label: string
}

export function LangButton({ active, onClick, label }: LangButtonProps) {
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
      <Globe className="h-4 w-4" />
      {label}
    </button>
  )
}
