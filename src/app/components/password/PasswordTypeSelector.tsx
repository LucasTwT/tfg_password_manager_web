import { useTranslation } from "react-i18next"
import { cn } from "@/utils/cn"
import { PasswordType } from "@/core/reducers/Create/useGenerateKeyTypes"

interface PasswordTypeSelectorProps {
  type: PasswordType
  onChange: (type: PasswordType) => void
}

const TYPES = [PasswordType.random, PasswordType.memorable] as const

export function PasswordTypeSelector({ type, onChange }: PasswordTypeSelectorProps) {
  const { t } = useTranslation()

  return (
    <div className="flex gap-2">
      {TYPES.map((t_) => (
        <button
          key={t_}
          type="button"
          onClick={() => onChange(t_)}
          className={cn(
            "flex-1 px-3 py-1.5 text-sm rounded-md border transition-colors cursor-pointer",
            type === t_
              ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "border-[var(--input)] text-[var(--muted-foreground)] hover:border-[var(--foreground)]"
          )}
        >
          {t(`passwordGenerator.${t_}`)}
        </button>
      ))}
    </div>
  )
}
