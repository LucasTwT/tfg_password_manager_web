import { useTranslation } from "react-i18next"
import { ChevronRight, Plus, Upload, Loader2 } from "lucide-react"
import { useAppState } from "@/app/context/AppContext"
import { cn } from "@/utils/cn"
import type { Vault } from "@/core/types/vault"
import { getVaultIcon } from "@/app/components/vaults/vaultIcons"
import { ContextMenu } from "@/app/components/ui/ContextMenu"
import { VaultFormModal } from "@/app/components/vaults/VaultFormModal"
import { LoginFormModal } from "@/app/components/logins/LoginFormModal"
import { useVaultActions } from "@/core/hooks/useVaultActions"
import { useLoginActions } from "@/core/hooks/useLoginActions"
import { useFileActions } from "@/core/hooks/useFileActions"
import { useVaultLogins } from "@/core/hooks/useVaultLogins"
import { useVaultFiles } from "@/core/hooks/useVaultFiles"
import { useFileUpload } from "@/core/hooks/useFileUpload"
import { UploadProgressModal } from "@/app/components/ui/UploadProgressModal"
import { useCryptoGuard } from "@/core/hooks/useCryptoGuard.tsx"
import { useVaultItemActions } from "@/core/hooks/useVaultItemActions.tsx"
import { LoginItem } from "./LoginItem"
import { FileItem } from "./FileItem"
import { VaultDeleteFlow } from "./VaultDeleteFlow"
import { useVaultItemReducer } from "@/core/hooks/useVaultItemReducer"
import { usePickFile } from "@/core/hooks/useFiles"
import { useGlobalStore } from "@/core/store/useGlobalStore"

interface VaultItemProps { vault: Vault }

export function VaultItem({ vault }: VaultItemProps) {
  const { t } = useTranslation()
  const { expandedVaultIds, activeVaultId } = useAppState()
  const isExpanded = expandedVaultIds.has(vault.id)
  const isActive = activeVaultId === vault.id
  const { modifyVault } = useVaultActions()
  const { loadLogins, createLogin } = useLoginActions()
  const { loadFiles } = useFileActions()
  const { ready: cryptoReady, requestUnlock, PasswordDialog } = useCryptoGuard()
  const { upload: uploadFile, uploading, progress, currentFileName } = useFileUpload()
  const { pickFile } = usePickFile()
  const { state, setContextMenu, setEditModal, setDeleteFlow, setLogins, setFiles, appendFile, removeFile, updateLogin, setLoading, setFilesLoading, setCreateModal } = useVaultItemReducer()
  const { reload: reloadLogins } = useVaultLogins({ enabled: isExpanded, vaultId: vault.id, loadLogins, onLoaded: setLogins, onLoadingChange: setLoading })
  const { reload: reloadFiles } = useVaultFiles({ enabled: isExpanded, vaultId: vault.id, loadFiles, onLoaded: setFiles, onLoadingChange: setFilesLoading })

  const {
    handleToggle, handleContextMenu, handleEditSave,
    handleCreateLogin, handleDeleteVault, contextMenuItems,
  } = useVaultItemActions({
    vault, cryptoReady, requestUnlock, modifyVault, createLogin,
    reloadLogins, setContextMenu, setEditModal, setDeleteFlow,
    setCreateModal, updateLogin, appendFile, removeFile,
  })

  const handleUploadFile = async () => {
    const result = await pickFile()
    if (!result || result.selectedUris.length === 0) return

    const keyHex = useGlobalStore.getState().cryptoContext?.vaultKey
    if (!keyHex) {
      console.error("[VaultItem] No vault key available for file upload")
      return
    }
    const keyStr = Array.from(keyHex).map(b => b.toString(16).padStart(2, '0')).join('')

    for (const webFile of result.selectedUris) {
      const newFile = await uploadFile(webFile, vault.id, keyStr)
      if (newFile) {
        window.dispatchEvent(new CustomEvent("file-uploaded", { detail: { vaultId: vault.id, file: newFile } }))
      }
    }
  }

  const VaultIcon = getVaultIcon(vault.settings?.icon)

  return (
    <>
      <div className="px-1.5">
        <button onClick={handleToggle} onContextMenu={handleContextMenu} className={cn("w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer hover:bg-[var(--accent)]", isActive && "bg-[var(--accent)]")}>
          <div className="flex items-center justify-center w-6 h-6 rounded text-xs shrink-0" style={{ backgroundColor: vault.settings?.colors?.bgColor || "var(--primary)", color: vault.settings?.colors?.icColor || "var(--primary-foreground)" }}>
            <VaultIcon className="h-3.5 w-3.5" />
          </div>
          <span className="flex-1 text-left truncate text-[var(--foreground)]">{vault.name}</span>
          <ChevronRight className={cn("h-3.5 w-3.5 text-[var(--muted-foreground)] transition-transform duration-150", isExpanded && "rotate-90")} />
        </button>
        {isExpanded && (
          <div className="ml-4 border-l border-[var(--border)] pl-2 py-0.5">
            {/* Logins section */}
            {state.loadingLogins ? (
              <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-[var(--muted-foreground)]"><Loader2 className="h-3 w-3 animate-spin" />{t("logins.actions.loading", { defaultValue: "Loading..." })}</div>
            ) : state.logins.length > 0 ? (
              <>{state.logins.map((login) => (<LoginItem key={login.id} login={login} />))}<button onClick={() => setCreateModal(true)} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors cursor-pointer text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]"><Plus className="h-3 w-3" />{t("logins.create.title")}</button></>
            ) : (
              <><p className="px-2 py-1.5 text-xs text-[var(--muted-foreground)]">{t("app.sidebar.noLogins")}</p><button onClick={() => setCreateModal(true)} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors cursor-pointer text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]"><Plus className="h-3 w-3" />{t("logins.create.title")}</button></>
            )}

            {/* Files section */}
            {state.loadingFiles ? (
              <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-[var(--muted-foreground)]"><Loader2 className="h-3 w-3 animate-spin" />{t("files.actions.loading", { defaultValue: "Loading files..." })}</div>
            ) : state.files.length > 0 ? (
              <>{state.files.map((file) => (<FileItem key={file.id} file={file} />))}<button onClick={handleUploadFile} disabled={uploading} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors cursor-pointer text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]"><Upload className="h-3 w-3" />{t("files.upload.title", { defaultValue: "Upload file" })}</button></>
            ) : (
              <><p className="px-2 py-1.5 text-xs text-[var(--muted-foreground)]">{t("app.sidebar.noFiles", { defaultValue: "No files" })}</p><button onClick={handleUploadFile} disabled={uploading} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors cursor-pointer text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]"><Upload className="h-3 w-3" />{t("files.upload.title", { defaultValue: "Upload file" })}</button></>
            )}
          </div>
        )}
      </div>
      {state.contextMenu && (<ContextMenu items={contextMenuItems} x={state.contextMenu.x} y={state.contextMenu.y} onClose={() => setContextMenu(null)} />)}
      {state.editModal && (<VaultFormModal mode="edit" vault={vault} onSave={handleEditSave} onClose={() => setEditModal(false)} />)}
      {state.createModal && (<LoginFormModal mode="create" onSave={handleCreateLogin} onClose={() => setCreateModal(false)} />)}
      {state.deleteFlow && (<VaultDeleteFlow vaultId={vault.id} onDelete={handleDeleteVault} onComplete={() => setDeleteFlow(false)} />)}
      {PasswordDialog}
      <UploadProgressModal
        open={uploading}
        fileName={currentFileName}
        percent={progress.percent}
        onClose={() => {}}
      />
    </>
  )
}
