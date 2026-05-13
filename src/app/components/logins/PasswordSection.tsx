import { useState, useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Eye, EyeOff, Shuffle } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { PasswordStrengthBar } from "@/app/components/password/PasswordStrengthBar"
import { PasswordGenerator } from "@/app/components/password/PasswordGenerator"
import {
  calculatePasswordStrength,
  getPasswordStrengthLabel,
} from "@/core/utils/passwordStrength"

interface PasswordSectionProps {
  password: string
  onChange: (password: string) => void
}

export function PasswordSection({ password, onChange }: PasswordSectionProps) {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)

  const strength = useMemo(() => calculatePasswordStrength(password), [password])
  const strengthLabel = getPasswordStrengthLabel(strength)

  const handleUsePassword = useCallback(
    (generated: string) => {
      onChange(generated)
      setShowPassword(true)
      setShowGenerator(false)
    },
    [onChange]
  )

  return (
    <div className="space-y-1.5">
      <Label>{t("app.content.loginDetail.password")}</Label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t("logins.create.passwordPlaceholder")}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            aria-label={
              showPassword
                ? t("logins.actions.hidePassword")
                : t("logins.actions.showPassword")
            }
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowGenerator((p) => !p)}
          aria-label={t("logins.create.generatePassword")}
        >
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>
      {password && <PasswordStrengthBar strength={strength} label={strengthLabel} />}
      {showGenerator && (
        <PasswordGenerator onUse={handleUsePassword} onClose={() => setShowGenerator(false)} />
      )}
    </div>
  )
}
