import { useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useAppDispatch } from "@/app/context/AppContext"
import type { Vault, VaultConfig } from "@/core/types/vault"
import type { Login } from "@/core/types/login"
import type { ContextMenuItem } from "@/app/components/ui/ContextMenu"
import { Pencil, Square, Trash2 } from "lucide-react"
import { finishDeleteVault } from "@/core/services/api/endpoints/vaults"

interface UseVaultItemActionsOptions {
  vault: Vault
  cryptoReady: boolean
  requestUnlock: () => void
  modifyVault: (vault: Vault) => Promise<boolean>
  createLogin: (vaultId: string, data: Omit<Login, "id" | "created_at" | "updated_at">) => Promise<{ success: boolean; error?: string; details?: any }>
  reloadLogins: () => Promise<void>
  setContextMenu: (position: { x: number; y: number } | null) => void
  setEditModal: (open: boolean) => void
  setDeleteFlow: (open: boolean) => void
  setCreateModal: (open: boolean) => void
  updateLogin: (loginId: string, updates: Partial<Login>) => void
  appendFile: (file: any) => void
  removeFile: (fileId: string) => void
}

export function useVaultItemActions({
  vault,
  cryptoReady,
  requestUnlock,
  modifyVault,
  createLogin,
  reloadLogins,
  setContextMenu,
  setEditModal,
  setDeleteFlow,
  setCreateModal,
  updateLogin,
  appendFile,
  removeFile,
}: UseVaultItemActionsOptions) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  // Listen for login-deleted events from LoginDetail
  useEffect(() => {
    const handleLoginDeleted = (event: Event) => {
      const customEvent = event as CustomEvent<{ vaultId: string; loginId: string }>
      if (customEvent.detail.vaultId === vault.id) {
        console.log(`[VaultItem] Login deleted in vault ${vault.id}, reloading logins...`)
        reloadLogins()
      }
    }
    window.addEventListener("login-deleted", handleLoginDeleted)
    return () => window.removeEventListener("login-deleted", handleLoginDeleted)
  }, [vault.id, reloadLogins])

  // Listen for login-modified events from LoginDetail
  useEffect(() => {
    const handleLoginModified = (event: Event) => {
      const customEvent = event as CustomEvent<{ vaultId: string; loginId: string; updates: Partial<Login> }>
      if (customEvent.detail.vaultId === vault.id) {
        console.log(`[VaultItem] Login modified in vault ${vault.id}, updating local state...`)
        updateLogin(customEvent.detail.loginId, customEvent.detail.updates)
      }
    }
    window.addEventListener("login-modified", handleLoginModified)
    return () => window.removeEventListener("login-modified", handleLoginModified)
  }, [vault.id, updateLogin])

  // Listen for file-uploaded events
  useEffect(() => {
    const handleFileUploaded = (event: Event) => {
      const customEvent = event as CustomEvent<{ vaultId: string; file: any }>
      if (customEvent.detail.vaultId === vault.id) {
        console.log(`[VaultItem] File uploaded in vault ${vault.id}, appending file...`)
        appendFile(customEvent.detail.file)
      }
    }
    window.addEventListener("file-uploaded", handleFileUploaded)
    return () => window.removeEventListener("file-uploaded", handleFileUploaded)
  }, [vault.id, appendFile])

  // Listen for file-deleted events
  useEffect(() => {
    const handleFileDeleted = (event: Event) => {
      const customEvent = event as CustomEvent<{ vaultId: string; fileId: string }>
      if (customEvent.detail.vaultId === vault.id) {
        console.log(`[VaultItem] File deleted in vault ${vault.id}, removing file...`)
        removeFile(customEvent.detail.fileId)
      }
    }
    window.addEventListener("file-deleted", handleFileDeleted)
    return () => window.removeEventListener("file-deleted", handleFileDeleted)
  }, [vault.id, removeFile])

  const handleToggle = useCallback(() => {
    dispatch({ type: "TOGGLE_VAULT_EXPAND", vaultId: vault.id })
    dispatch({ type: "SELECT_VAULT", vaultId: vault.id })
  }, [dispatch, vault.id])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [setContextMenu])

  const handleEditSave = useCallback(async (name: string, config: VaultConfig) => {
    await modifyVault({ ...vault, name, settings: config })
    setEditModal(false)
  }, [vault, modifyVault, setEditModal])

  const handleCreateLogin = useCallback(async (data: Omit<Login, "id" | "created_at" | "updated_at">) => {
    console.log("[handleCreateLogin] Starting create login flow")
    if (!cryptoReady) {
      console.warn("[handleCreateLogin] Crypto context not ready - requesting unlock")
      requestUnlock()
      return
    }
    const result = await createLogin(vault.id, data)
    if (result.success) {
      console.log("[handleCreateLogin] Login created successfully, reloading logins...")
      setCreateModal(false)
      await reloadLogins()
      console.log("[handleCreateLogin] Logins reloaded successfully")
    } else {
      console.error("[handleCreateLogin] Failed to create login", result.error, result.details)
    }
  }, [vault.id, createLogin, setCreateModal, reloadLogins, cryptoReady, requestUnlock])

  const handleDeleteVault = useCallback(async (signature: string) => {
    const result = await finishDeleteVault(signature, vault.id)
    return !!result.status
  }, [vault.id])

  const contextMenuItems: ContextMenuItem[] = [
    { label: t("vaults.contextMenu.rename"), icon: <Pencil className="h-3.5 w-3.5" />, onClick: () => setEditModal(true) },
    { label: t("vaults.contextMenu.changeIcon"), icon: <Pencil className="h-3.5 w-3.5" />, onClick: () => setEditModal(true) },
    { label: t("vaults.contextMenu.changeColor"), icon: <Square className="h-3.5 w-3.5" />, onClick: () => setEditModal(true) },
    { label: t("vaults.contextMenu.delete"), icon: <Trash2 className="h-3.5 w-3.5" />, onClick: () => setDeleteFlow(true), destructive: true },
  ]

  return {
    handleToggle,
    handleContextMenu,
    handleEditSave,
    handleCreateLogin,
    handleDeleteVault,
    contextMenuItems,
  }
}
