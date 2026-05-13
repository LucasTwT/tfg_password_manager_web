import { useTranslation } from "react-i18next"
import { cn } from "@/utils/cn"

interface PasswordStrengthBarProps {
  strength: number
  label: string
}

const STRENGTH_COLORS = [
  "",
  "bg-[var(--destructive)]",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-[var(--success)]",
]

export function PasswordStrengthBar({ strength, label }: PasswordStrengthBarProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-[var(--muted)] overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", STRENGTH_COLORS[strength])}
          style={{ width: `${(strength / 4) * 100}%` }}
        />
      </div>
      <span className="text-xs text-[var(--muted-foreground)] min-w-[40px]">
        {label ? t(label) : ""}
      </span>
    </div>
  )
}
