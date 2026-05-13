import { useTranslation } from "react-i18next"
import type { PasswordGeneratorOptions } from "@/core/reducers/Create/useGenerateKeyTypes"

interface RandomOptionsProps {
  options: PasswordGeneratorOptions
  onOptionChange: (field: keyof PasswordGeneratorOptions, value: boolean | number) => void
}

interface CheckboxOption {
  field: keyof PasswordGeneratorOptions
  labelKey: string
}

const CHECKBOX_OPTIONS: CheckboxOption[] = [
  { field: "includeUppercase", labelKey: "passwordGenerator.uppercase" },
  { field: "includeNumbers", labelKey: "passwordGenerator.numbers" },
  { field: "includeSymbols", labelKey: "passwordGenerator.symbols" },
  { field: "avoidAmbiguous", labelKey: "passwordGenerator.avoidAmbiguous" },
]

export function RandomOptions({ options, onOptionChange }: RandomOptionsProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-3">
      {/* Length slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm text-[var(--muted-foreground)]">
            {t("passwordGenerator.length")}
          </label>
          <span className="text-sm font-mono text-[var(--foreground)]">{options.length}</span>
        </div>
        <input
          type="range"
          min={4}
          max={64}
          value={options.length}
          onChange={(e) => onOptionChange("length", Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none bg-[var(--muted)] accent-[var(--primary)] cursor-pointer"
        />
      </div>

      {/* Checkboxes */}
      <div className="grid grid-cols-2 gap-2">
        {CHECKBOX_OPTIONS.map(({ field, labelKey }) => (
          <label
            key={field}
            className="flex items-center gap-2 text-sm text-[var(--foreground)] cursor-pointer"
          >
            <input
              type="checkbox"
              checked={options[field] as boolean}
              onChange={(e) => onOptionChange(field, e.target.checked)}
              className="accent-[var(--primary)]"
            />
            {t(labelKey)}
          </label>
        ))}
        {/* No repeating — inverted: checked means NO repeating (allowRepeating = false) */}
        <label className="flex items-center gap-2 text-sm text-[var(--foreground)] cursor-pointer">
          <input
            type="checkbox"
            checked={!options.allowRepeating}
            onChange={(e) => onOptionChange("allowRepeating", !e.target.checked)}
            className="accent-[var(--primary)]"
          />
          {t("passwordGenerator.noRepeating")}
        </label>
      </div>
    </div>
  )
}
