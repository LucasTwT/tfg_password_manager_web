import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Copy, Check } from "lucide-react"
import { cn } from "@/utils/cn"

interface PasswordDisplayProps {
  password: string
  onCopy: () => void
  copied: boolean
}

export function PasswordDisplay({ password, onCopy, copied }: PasswordDisplayProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2 rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2">
      <span className="flex-1 text-sm font-mono text-[var(--foreground)] break-all select-all">
        {password}
      </span>
      <button
        type="button"
        onClick={onCopy}
        className={cn(
          "shrink-0 p-1 rounded transition-colors cursor-pointer",
          copied
            ? "text-[var(--success)]"
            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        )}
        aria-label={t("passwordGenerator.copy")}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  )
}
