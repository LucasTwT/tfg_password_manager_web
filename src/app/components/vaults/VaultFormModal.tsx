import { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"
import { cn } from "@/utils/cn"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import type { Vault, VaultConfig } from "@/core/types/vault"
import { getVaultIcon, VAULT_ICON_NAMES, VAULT_ICONS, VAULT_COLORS } from "./vaultIcons"

interface VaultFormModalProps {
  mode: "create" | "edit"
  vault?: Vault
  onSave: (name: string, config: VaultConfig) => void
  onClose: () => void
}

export function VaultFormModal({ mode, vault, onSave, onClose }: VaultFormModalProps) {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(vault?.name ?? "")
  const [selectedIcon, setSelectedIcon] = useState(vault?.settings?.icon ?? "shield")
  const [selectedBg, setSelectedBg] = useState(vault?.settings?.colors?.bgColor ?? VAULT_COLORS[0].bg)
  const [selectedIc, setSelectedIc] = useState(vault?.settings?.colors?.icColor ?? VAULT_COLORS[0].ic)
  const [nameError, setNameError] = useState("")

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleEscape)
    inputRef.current?.focus()
    return () => document.removeEventListener("keydown", handleEscape)
  }, [handleEscape])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose()
      }
    },
    [onClose]
  )

  function validateName(value: string): string {
    if (!value.trim()) return t("vaults.create.namePlaceholder") + " — " + t("vaults.create.namePlaceholder")
    if (value.trim().length < 2) return t("vaults.create.namePlaceholder")
    return ""
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setName(value)
    if (value.trim().length >= 2) setNameError("")
  }

  function handleSave() {
    const trimmed = name.trim()
    if (trimmed.length < 2) {
      setNameError(t("vaults.create.namePlaceholder"))
      inputRef.current?.focus()
      return
    }

    const colorMatch = VAULT_COLORS.find((c) => c.bg === selectedBg)
    const icColor = colorMatch?.ic ?? selectedIc

    onSave(trimmed, {
      icon: selectedIcon,
      colors: { bgColor: selectedBg, icColor },
    })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSave()
  }

  const title = mode === "create" ? t("vaults.create.title") : t("vaults.edit.title")
  const saveLabel = mode === "create" ? t("vaults.create.save") : t("vaults.edit.save")
  const PreviewIcon = getVaultIcon(selectedIcon)

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--popover)] p-6 shadow-xl"
        onKeyDown={handleKeyDown}
      >
        <h2 className="text-lg font-semibold text-[var(--foreground)]">{title}</h2>

        {/* Preview */}
        <div className="mt-4 flex justify-center">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-lg"
            style={{ backgroundColor: selectedBg, color: selectedIc }}
          >
            <PreviewIcon className="h-6 w-6" />
          </div>
        </div>

        {/* Name */}
        <div className="mt-4 space-y-1.5">
          <Label>{t("vaults.create.namePlaceholder")}</Label>
          <Input
            ref={inputRef}
            value={name}
            onChange={handleNameChange}
            placeholder={t("vaults.create.namePlaceholder")}
          />
          {nameError && (
            <p className="text-xs text-red-500">{nameError}</p>
          )}
        </div>

        {/* Icon picker */}
        <div className="mt-4 space-y-1.5">
          <Label>{t("vaults.create.selectIcon")}</Label>
          <div className="grid grid-cols-5 gap-1.5">
            {VAULT_ICON_NAMES.map((iconName) => {
              const Icon = VAULT_ICONS[iconName]
              return (
                <button
                  key={iconName}
                  onClick={() => setSelectedIcon(iconName)}
                  className={cn(
                    "flex items-center justify-center h-9 rounded-md border cursor-pointer transition-colors",
                    selectedIcon === iconName
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "border-[var(--border)] hover:bg-[var(--accent)] text-[var(--muted-foreground)]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              )
            })}
          </div>
        </div>

        {/* Color picker */}
        <div className="mt-4 space-y-1.5">
          <Label>{t("vaults.create.selectColor")}</Label>
          <div className="grid grid-cols-5 gap-1.5">
            {VAULT_COLORS.map((color) => (
              <button
                key={color.bg}
                onClick={() => {
                  setSelectedBg(color.bg)
                  setSelectedIc(color.ic)
                }}
                className={cn(
                  "flex items-center justify-center h-9 rounded-md border-2 cursor-pointer transition-all",
                  selectedBg === color.bg
                    ? "border-[var(--foreground)] scale-110"
                    : "border-transparent hover:scale-105"
                )}
                style={{ backgroundColor: color.bg }}
              >
                {selectedBg === color.bg && (
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color.ic }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t("vaults.create.cancel")}
          </Button>
          <Button onClick={handleSave}>{saveLabel}</Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
