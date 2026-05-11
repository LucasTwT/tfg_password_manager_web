import { useTranslation } from "react-i18next"
import {
  User,
  Mail,
  Globe,
  FileText,
  Clock,
  Pencil,
  Save,
  X,
  Trash2,
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import type { Login } from "@/core/types/login"
import { useLoginDetail } from "@/core/hooks/useLoginDetail"
import { FieldRow, PasswordField } from "./fields"

interface LoginDetailProps {
  login: Login
  onSave?: (data: Partial<Login>) => void
}

export function LoginDetail({ login, onSave }: LoginDetailProps) {
  const { t } = useTranslation()
  const {
    isEditing,
    editData,
    showPassword,
    copiedField,
    startEdit,
    cancelEdit,
    saveEdit,
    updateField,
    togglePassword,
    copyField,
  } = useLoginDetail(login, onSave)

  const displayValue = (field: keyof Login): string => {
    if (isEditing) return editData[field] ?? login[field] ?? ""
    return login[field] ?? ""
  }

  const maskedPassword = login.password
    ? "\u2022".repeat(Math.min(login.password.length, 16))
    : ""

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">
            {isEditing ? (
              <Input
                value={displayValue("title")}
                onChange={(e) => updateField("title", e.target.value)}
                className="text-xl font-semibold"
              />
            ) : (
              login.title || t("app.tabs.untitled")
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={cancelEdit}>
                  <X className="h-4 w-4 mr-1" />
                  {t("app.content.loginDetail.cancel")}
                </Button>
                <Button size="sm" onClick={saveEdit}>
                  <Save className="h-4 w-4 mr-1" />
                  {t("app.content.loginDetail.save")}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={startEdit}>
                  <Pencil className="h-4 w-4 mr-1" />
                  {t("app.content.loginDetail.edit")}
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  {t("app.content.loginDetail.delete")}
                </Button>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
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

          <FieldRow
            icon={<Globe className="h-4 w-4" />}
            label={t("app.content.loginDetail.url")}
            value={displayValue("url")}
            field="url"
            isEditing={isEditing}
            copiedField={copiedField}
            onCopy={() => copyField("url", login.url)}
            onChange={(val) => updateField("url", val)}
          />

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

          {login.updated_at && (
            <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] pt-4 border-t border-[var(--border)]">
              <Clock className="h-3.5 w-3.5" />
              {t("app.content.loginDetail.lastModified")}:{" "}
              {new Date(login.updated_at).toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
