import { useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"
import { Button } from "./button"

interface DeleteConfirmDialogProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDivElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel()
    },
    [onCancel]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleEscape)
    cancelRef.current?.focus()
    return () => document.removeEventListener("keydown", handleEscape)
  }, [handleEscape])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onCancel()
      }
    },
    [onCancel]
  )

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--popover)] p-6 shadow-xl"
      >
        <h2 className="text-lg font-semibold text-[var(--foreground)]">{title}</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button ref={cancelRef} variant="outline" onClick={onCancel}>
            {t("vaults.delete.cancel")}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t("vaults.delete.confirm")}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
