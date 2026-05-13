import { useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { RefreshCw, Check } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { usePasswordGenerator } from "@/core/hooks/usePasswordGenerator"
import { PasswordType } from "@/core/reducers/Create/useGenerateKeyTypes"
import { PasswordDisplay } from "./PasswordDisplay"
import { PasswordStrengthBar } from "./PasswordStrengthBar"
import { PasswordTypeSelector } from "./PasswordTypeSelector"
import { RandomOptions } from "./RandomOptions"
import { MemorableOptions } from "./MemorableOptions"

interface PasswordGeneratorProps {
  onUse: (password: string) => void
  onClose: () => void
}

export function PasswordGenerator({ onUse, onClose }: PasswordGeneratorProps) {
  const { t } = useTranslation()
  const { state, setOption, setType, regenerate, strength, strengthLabel } =
    usePasswordGenerator()
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(state.password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [state.password])

  const handleUse = useCallback(() => {
    onUse(state.password)
  }, [onUse, state.password])

  return (
    <div className="space-y-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--popover)]">
      {/* Header */}
      <h3 className="text-sm font-semibold text-[var(--foreground)]">
        {t("passwordGenerator.title")}
      </h3>

      {/* Password display + strength */}
      <div className="space-y-2">
        <PasswordDisplay password={state.password} onCopy={handleCopy} copied={copied} />
        <PasswordStrengthBar strength={strength} label={strengthLabel} />
      </div>

      {/* Type selector */}
      <PasswordTypeSelector type={state.keyOptions.type} onChange={setType} />

      {/* Options based on type */}
      {state.keyOptions.type === PasswordType.random ? (
        <RandomOptions options={state.keyOptions} onOptionChange={setOption} />
      ) : (
        <MemorableOptions options={state.keyOptions} onOptionChange={setOption} />
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={regenerate} className="flex-1">
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          {t("passwordGenerator.regenerate")}
        </Button>
        <Button type="button" size="sm" onClick={handleUse} className="flex-1">
          <Check className="h-3.5 w-3.5 mr-1" />
          {t("passwordGenerator.usePassword")}
        </Button>
      </div>
    </div>
  )
}
