import { useTranslation } from "react-i18next"
import { Clock } from "lucide-react"
import { Input } from "@/app/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import type { Login } from "@/core/types/login"
import { useLoginDetail } from "@/core/hooks/useLoginDetail"
import { useLoginActions } from "@/core/hooks/useLoginActions"
import { useCryptoGuard } from "@/core/hooks/useCryptoGuard.tsx"
import { DeleteConfirmDialog } from "@/app/components/ui/DeleteConfirmDialog"
import { MasterPasswordDialog } from "@/app/components/ui/MasterPasswordDialog"
import { LoginActions } from "./LoginActions"
import { LoginFields } from "./LoginFields"
import { useLoginDeleteFlow } from "@/core/hooks/useLoginDeleteFlow"
import { useLoginDetailActions } from "@/core/hooks/useLoginDetailActions"

interface LoginDetailProps {
  login: Login
}

export function LoginDetail({ login }: LoginDetailProps) {
  const { t } = useTranslation()
  const { modifyLogin } = useLoginActions()
  const { ready: cryptoReady, requestUnlock, PasswordDialog: CryptoGuardDialog } = useCryptoGuard()

  const {
    deleteDialog, passwordDialog,
    handleDeleteConfirm, handleDeleteCancel,
    handleDeleteStart, handlePasswordConfirm, handlePasswordCancel,
  } = useLoginDeleteFlow({ login })

  // First pass: get handleSave (no dependency on editing state)
  const { handleSave } = useLoginDetailActions({ login, cryptoReady, requestUnlock, modifyLogin })

  const {
    isEditing, editData, showPassword, copiedField,
    startEdit, cancelEdit, saveEdit, updateField, togglePassword, copyField,
  } = useLoginDetail(login, handleSave)

  // Second pass: get actions that depend on editing state
  const { handleGeneratePassword, handleOpenUrl } = useLoginDetailActions({
    login, cryptoReady, requestUnlock, modifyLogin, updateField, isEditing, editDataUrl: editData.url,
  })

  const displayValue = (field: keyof Login): string =>
    isEditing ? editData[field] ?? login[field] ?? "" : login[field] ?? ""

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
            <LoginActions
              isEditing={isEditing}
              onStartEdit={startEdit}
              onCancelEdit={cancelEdit}
              onSave={saveEdit}
              onDelete={handleDeleteConfirm}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <LoginFields
            login={login}
            isEditing={isEditing}
            editData={editData}
            showPassword={showPassword}
            copiedField={copiedField}
            maskedPassword={maskedPassword}
            displayValue={displayValue}
            updateField={updateField}
            togglePassword={togglePassword}
            copyField={copyField}
            onGeneratePassword={handleGeneratePassword}
            onOpenUrl={handleOpenUrl}
          />

          {login.updated_at && (
            <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] pt-4 border-t border-[var(--border)]">
              <Clock className="h-3.5 w-3.5" />
              {t("app.content.loginDetail.lastModified")}:{" "}
              {new Date(login.updated_at).toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>

      {deleteDialog && (
        <DeleteConfirmDialog
          title={t("logins.delete.title")}
          message={t("logins.delete.message")}
          onConfirm={handleDeleteStart}
          onCancel={handleDeleteCancel}
        />
      )}

      {passwordDialog && (
        <MasterPasswordDialog
          title={t("app.masterPassword.title")}
          onConfirm={handlePasswordConfirm}
          onCancel={handlePasswordCancel}
        />
      )}

      {CryptoGuardDialog}
    </div>
  )
}
