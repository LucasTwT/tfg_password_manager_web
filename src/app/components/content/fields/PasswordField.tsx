import { useTranslation } from "react-i18next"
import { Eye, EyeOff, Copy, Check, KeyRound } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { cn } from "@/utils/cn"

interface PasswordFieldProps {
  value: string
  rawValue: string
  isEditing: boolean
  showPassword: boolean
  copiedField: string | null
  onTogglePassword: () => void
  onCopy: () => void
  onChange: (value: string) => void
}

export function PasswordField({
  value,
  rawValue,
  isEditing,
  showPassword,
  copiedField,
  onTogglePassword,
  onCopy,
  onChange,
}: PasswordFieldProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-[var(--muted-foreground)]">
        <KeyRound className="h-4 w-4" />
        {t("app.content.loginDetail.password")}
      </Label>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <div className="relative flex-1">
            <Input
              type={showPassword ? "text" : "password"}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              aria-label={
                showPassword
                  ? t("app.content.loginDetail.hidePassword")
                  : t("app.content.loginDetail.showPassword")
              }
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        ) : (
          <>
            <span
              className={cn(
                "flex-1 text-sm font-mono truncate",
                showPassword
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)]"
              )}
            >
              {showPassword ? rawValue : value}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={onTogglePassword}
              aria-label={
                showPassword
                  ? t("app.content.loginDetail.hidePassword")
                  : t("app.content.loginDetail.showPassword")
              }
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onCopy}
          aria-label={t("app.content.loginDetail.copy")}
        >
          {copiedField === "password" ? (
            <Check className="h-4 w-4 text-[var(--success)]" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
