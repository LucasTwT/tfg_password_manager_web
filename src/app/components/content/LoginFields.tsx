import { useTranslation } from "react-i18next"
import { User, Mail, Globe, FileText, ExternalLink, Shuffle } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import type { Login } from "@/core/types/login"
import { FieldRow, PasswordField } from "./fields"

interface LoginFieldsProps {
  login: Login
  isEditing: boolean
  editData: Partial<Login>
  showPassword: boolean
  copiedField: string | null
  maskedPassword: string
  displayValue: (field: keyof Login) => string
  updateField: (field: keyof Login, value: string) => void
  togglePassword: () => void
  copyField: (field: keyof Login, value: string) => void
  onGeneratePassword: () => void
  onOpenUrl: () => void
}

export function LoginFields({
  login,
  isEditing,
  showPassword,
  copiedField,
  maskedPassword,
  displayValue,
  updateField,
  togglePassword,
  copyField,
  onGeneratePassword,
  onOpenUrl,
}: LoginFieldsProps) {
  const { t } = useTranslation()

  return (
    <>
      <FieldRow
        icon={<User className="h-4 w-4" />}
        label={t("app.content.loginDetail.username")}
        value={displayValue("username")}
        field="username"
        isEditing={isEditing}
        copiedField={copiedField}
        onCopy={() => copyField("username", login.username)}
        onChange={(val) => updateField("username", val)}
      />

      <FieldRow
        icon={<Mail className="h-4 w-4" />}
        label={t("app.content.loginDetail.email")}
        value={displayValue("email")}
        field="email"
        isEditing={isEditing}
        copiedField={copiedField}
        onCopy={() => copyField("email", login.email)}
        onChange={(val) => updateField("email", val)}
      />

      <div className="space-y-2">
        <PasswordField
          value={isEditing ? displayValue("password") : maskedPassword}
          rawValue={login.password}
          isEditing={isEditing}
          showPassword={showPassword}
          copiedField={copiedField}
          onTogglePassword={togglePassword}
          onCopy={() => copyField("password", login.password)}
          onChange={(val) => updateField("password", val)}
        />
        {isEditing && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onGeneratePassword}
            className="mt-1"
          >
            <Shuffle className="h-3.5 w-3.5 mr-1" />
            {t("logins.create.generatePassword")}
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)]">
          <Globe className="h-4 w-4" />
          {t("app.content.loginDetail.url")}
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Input
                value={displayValue("url")}
                onChange={(e) => updateField("url", e.target.value)}
                placeholder={t("logins.create.urlPlaceholder")}
                className="flex-1"
              />
              {login.url && (
                <Button variant="outline" size="icon" onClick={onOpenUrl} aria-label={t("logins.actions.openUrl")}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </>
          ) : (
            <>
              <span className="flex-1 text-sm text-[var(--foreground)] truncate">
                {login.url || "\u2014"}
              </span>
              {login.url && (
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onOpenUrl} aria-label={t("logins.actions.openUrl")}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)]">
          <FileText className="h-4 w-4" />
          {t("app.content.loginDetail.notes")}
        </div>
        {isEditing ? (
          <textarea
            value={displayValue("notes")}
            onChange={(e) => updateField("notes", e.target.value)}
            className="flex min-h-[80px] w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          />
        ) : (
          <p className="text-sm text-[var(--foreground)] whitespace-pre-wrap">
            {login.notes || "\u2014"}
          </p>
        )}
      </div>
    </>
  )
}
