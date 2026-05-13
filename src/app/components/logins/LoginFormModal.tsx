import { useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"
import { ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import type { Login } from "@/core/types/login"
import { FormField } from "./FormField"
import { PasswordSection } from "./PasswordSection"
import { useLoginFormReducer } from "@/core/hooks/useLoginFormReducer"

interface LoginFormModalProps {
  mode: "create" | "edit"
  login?: Login
  onSave: (data: Omit<Login, "id" | "created_at" | "updated_at">) => Promise<void>
  onClose: () => void
}

export function LoginFormModal({ mode, login, onSave, onClose }: LoginFormModalProps) {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  // Form state managed by reducer - extracts 6 useState calls
  const { state, setField, setSaving, setTitleError, validate } = useLoginFormReducer({
    title: login?.title ?? "", username: login?.username ?? "", email: login?.email ?? "",
    password: login?.password ?? "", url: login?.url ?? "", notes: login?.notes ?? "",
  })
  // Keyboard handling - moved from inline useEffect
  const handleEscape = useCallback((e: KeyboardEvent) => { if (e.key === "Escape") onClose() }, [onClose])
  useEffect(() => {
    document.addEventListener("keydown", handleEscape)
    titleRef.current?.focus()
    return () => document.removeEventListener("keydown", handleEscape)
  }, [handleEscape])
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) onClose()
  }, [onClose])
  function handleOpenUrl() {
    if (state.url) {
      const finalUrl = state.url.startsWith("http") ? state.url : `https://${state.url}`
      window.open(finalUrl, "_blank", "noopener,noreferrer")
    }
  }
  async function handleSave() {
    if (!validate()) { titleRef.current?.focus(); return }
    setSaving(true)
    try { await onSave({ title: state.title.trim(), username: state.username, email: state.email, password: state.password, url: state.url, notes: state.notes }) }
    finally { setSaving(false) }
  }
  const modalTitle = mode === "create" ? t("logins.create.title") : t("logins.edit.title")
  const saveLabel = mode === "create" ? t("logins.create.save") : t("logins.edit.save")
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50" onClick={handleBackdropClick}>
      <div ref={dialogRef} className="w-full max-w-lg rounded-lg border border-[var(--border)] bg-[var(--popover)] shadow-xl max-h-[90vh] overflow-y-auto" onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSave())}>
        <div className="p-6 border-b border-[var(--border)]"><h2 className="text-lg font-semibold text-[var(--foreground)]">{modalTitle}</h2></div>
        <div className="p-6 space-y-4">
          <FormField ref={titleRef} label={t("app.content.loginDetail.title")} value={state.title} onChange={(v) => { setField("title", v); if (v.trim()) setTitleError("") }} placeholder={t("logins.create.titlePlaceholder")} error={state.titleError} />
          <FormField label={t("app.content.loginDetail.username")} value={state.username} onChange={(v) => setField("username", v)} placeholder={t("logins.create.usernamePlaceholder")} />
          <FormField label={t("app.content.loginDetail.email")} value={state.email} onChange={(v) => setField("email", v)} type="email" placeholder={t("logins.create.emailPlaceholder")} />
          <PasswordSection password={state.password} onChange={(v) => setField("password", v)} />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--foreground)]">{t("app.content.loginDetail.url")}</label>
            <div className="flex items-center gap-2">
              <Input value={state.url} onChange={(e) => setField("url", e.target.value)} placeholder={t("logins.create.urlPlaceholder")} className="flex-1" />
              {state.url && (<Button type="button" variant="outline" size="icon" onClick={handleOpenUrl} aria-label={t("logins.actions.openUrl")}><ExternalLink className="h-4 w-4" /></Button>)}
            </div>
          </div>
          <FormField label={t("app.content.loginDetail.notes")} value={state.notes} onChange={(v) => setField("notes", v)} placeholder={t("logins.create.notesPlaceholder")} textarea />
        </div>
        <div className="p-6 border-t border-[var(--border)] flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={state.saving}>{t("logins.create.cancel")}</Button>
          <Button onClick={handleSave} disabled={state.saving}>{state.saving && <Loader2 className="h-4 w-4 animate-spin mr-1" />}{saveLabel}</Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
