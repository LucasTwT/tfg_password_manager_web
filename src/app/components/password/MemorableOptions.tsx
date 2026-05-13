import { useTranslation } from "react-i18next"
import type { PasswordGeneratorOptions } from "@/core/reducers/Create/useGenerateKeyTypes"

interface MemorableOptionsProps {
  options: PasswordGeneratorOptions
  onOptionChange: (field: keyof PasswordGeneratorOptions, value: boolean | number) => void
}

export function MemorableOptions({ options, onOptionChange }: MemorableOptionsProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm text-[var(--muted-foreground)]">
          {t("passwordGenerator.words")}
        </label>
        <span className="text-sm font-mono text-[var(--foreground)]">{options.wordsCount}</span>
      </div>
      <input
        type="range"
        min={3}
        max={8}
        value={options.wordsCount}
        onChange={(e) => onOptionChange("wordsCount", Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-[var(--muted)] accent-[var(--primary)] cursor-pointer"
      />
    </div>
  )
}
