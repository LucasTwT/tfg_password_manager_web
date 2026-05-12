import { useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { ChevronRight, Pencil, Square, Trash2 } from "lucide-react"
import { useAppDispatch, useAppState } from "@/app/context/AppContext"
import { cn } from "@/utils/cn"
import type { Vault, VaultConfig } from "@/core/types/vault"
import { getVaultIcon } from "@/app/components/vaults/vaultIcons"
import { ContextMenu, type ContextMenuItem } from "@/app/components/ui/ContextMenu"
import { VaultFormModal } from "@/app/components/vaults/VaultFormModal"
import { DeleteConfirmDialog } from "@/app/components/ui/DeleteConfirmDialog"
import { MasterPasswordDialog } from "@/app/components/ui/MasterPasswordDialog"
import { useVaultActions } from "@/core/hooks/useVaultActions"
import { regenerateKeys, signChallenge } from "@/core/services/crypto"
import { finishDeleteVault } from "@/core/services/api/endpoints/vaults"
import { storage } from "@/core/storage"
import { LoginItem } from "./LoginItem"

interface VaultItemProps {
  vault: Vault
}

export function VaultItem({ vault }: VaultItemProps) {
  const { t } = useTranslation()
  const { expandedVaultIds, activeVaultId } = useAppState()
  const dispatch = useAppDispatch()
  const isExpanded = expandedVaultIds.has(vault.id)
  const isActive = activeVaultId === vault.id
  const { modifyVault } = useVaultActions()

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [editModal, setEditModal] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [passwordDialog, setPasswordDialog] = useState(false)
  const [pendingDeleteChallenge, setPendingDeleteChallenge] = useState<string | null>(null)

  const VaultIcon = getVaultIcon(vault.settings?.icon)

  const handleToggle = () => {
    dispatch({ type: "TOGGLE_VAULT_EXPAND", vaultId: vault.id })
    dispatch({ type: "SELECT_VAULT", vaultId: vault.id })
  }

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  const handleEditSave = useCallback(
    async (name: string, config: VaultConfig) => {
      const updated: Vault = { ...vault, name, settings: config }
      await modifyVault(updated)
      setEditModal(false)
    },
    [vault, modifyVault]
  )

  const handleDeleteStart = useCallback(async () => {
    // Import dynamically to avoid circular deps
    const { startDeleteVault } = await import("@/core/services/api/endpoints/vaults")
    const { signChallenge } = await import("@/core/services/crypto")

    const startResult = await startDeleteVault()
    if (!startResult.status) return

    const challenge = startResult.response?.challenge
    if (!challenge) return

    const signature = await signChallenge(challenge)
    if (!signature) {
      // Need master password
      setPendingDeleteChallenge(challenge)
      setPasswordDialog(true)
      setDeleteDialog(false)
      return
    }

    // Has crypto context — proceed directly
    const result = await finishDeleteVault(signature, vault.id)
    if (result.status) setDeleteDialog(false)
  }, [vault.id])

  const handlePasswordConfirm = useCallback(
    async (password: string) => {
      if (!pendingDeleteChallenge) return

      const data = await storage.get<{ salt: string }>("sensitive_data")
      if (!data?.salt) throw new Error("No salt found")

      await regenerateKeys(password, data.salt)
      const signature = await signChallenge(pendingDeleteChallenge)
      if (!signature) throw new Error("Failed to sign challenge")

      const result = await finishDeleteVault(signature, vault.id)
      if (result.status) {
        setPasswordDialog(false)
        setPendingDeleteChallenge(null)
      }
    },
    [pendingDeleteChallenge, vault.id]
  )

  const contextMenuItems: ContextMenuItem[] = [
    {
      label: t("vaults.contextMenu.rename"),
      icon: <Pencil className="h-3.5 w-3.5" />,
      onClick: () => setEditModal(true),
    },
    {
      label: t("vaults.contextMenu.changeIcon"),
      icon: <Pencil className="h-3.5 w-3.5" />,
      onClick: () => setEditModal(true),
    },
    {
      label: t("vaults.contextMenu.changeColor"),
      icon: <Square className="h-3.5 w-3.5" />,
      onClick: () => setEditModal(true),
    },
    {
      label: t("vaults.contextMenu.delete"),
      icon: <Trash2 className="h-3.5 w-3.5" />,
      onClick: () => setDeleteDialog(true),
      destructive: true,
    },
  ]

  const logins: { id: string; title: string }[] = []

  return (
    <>
      <div className="px-1.5">
        <button
          onClick={handleToggle}
          onContextMenu={handleContextMenu}
          className={cn(
            "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer",
            "hover:bg-[var(--accent)]",
            isActive && "bg-[var(--accent)]"
          )}
        >
          <div
            className="flex items-center justify-center w-6 h-6 rounded text-xs shrink-0"
            style={{
              backgroundColor: vault.settings?.colors?.bgColor || "var(--primary)",
              color: vault.settings?.colors?.icColor || "var(--primary-foreground)",
            }}
          >
            <VaultIcon className="h-3.5 w-3.5" />
          </div>
          <span className="flex-1 text-left truncate text-[var(--foreground)]">
            {vault.name}
          </span>
          <ChevronRight
            className={cn(
              "h-3.5 w-3.5 text-[var(--muted-foreground)] transition-transform duration-150",
              isExpanded && "rotate-90"
            )}
          />
        </button>

        {isExpanded && (
          <div className="ml-4 border-l border-[var(--border)] pl-2 py-0.5">
            {logins.length > 0 ? (
              logins.map((login) => (
                <LoginItem
                  key={login.id}
                  login={{
                    id: login.id,
                    vaultId: vault.id,
                    title: login.title,
                    username: "",
                    email: "",
                    password: "",
                    url: "",
                    notes: "",
                    created_at: "",
                    updated_at: "",
                  }}
                />
              ))
            ) : (
              <p className="px-2 py-1.5 text-xs text-[var(--muted-foreground)]">
                {t("app.sidebar.noLogins")}
              </p>
            )}
          </div>
        )}
      </div>

      {contextMenu && (
        <ContextMenu
          items={contextMenuItems}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}

      {editModal && (
        <VaultFormModal
          mode="edit"
          vault={vault}
          onSave={handleEditSave}
          onClose={() => setEditModal(false)}
        />
      )}

      {deleteDialog && (
        <DeleteConfirmDialog
          title={t("vaults.delete.title")}
          message={t("vaults.delete.message")}
          onConfirm={handleDeleteStart}
          onCancel={() => setDeleteDialog(false)}
        />
      )}

      {passwordDialog && (
        <MasterPasswordDialog
          title={t("app.masterPassword.title")}
          onConfirm={handlePasswordConfirm}
          onCancel={() => {
            setPasswordDialog(false)
            setPendingDeleteChallenge(null)
          }}
        />
      )}
    </>
  )
}
