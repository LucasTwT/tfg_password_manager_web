import { useTranslation } from "react-i18next"
import { Download, Trash2, File, Clock, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import type { VaultFile } from "@/core/types/file"
import { useFileDownload } from "@/core/hooks/useFileDownload"
import { useFileDeleteFlow } from "@/core/hooks/useFileDeleteFlow"
import { DeleteConfirmDialog } from "@/app/components/ui/DeleteConfirmDialog"
import { MasterPasswordDialog } from "@/app/components/ui/MasterPasswordDialog"
import { useGlobalStore } from "@/core/store/useGlobalStore"

interface FileDetailProps {
  file: VaultFile
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileDetail({ file }: FileDetailProps) {
  const { t } = useTranslation()
  const { download, downloading, progress } = useFileDownload()
  const {
    deleteDialog, passwordDialog, deleting,
    handleDeleteConfirm, handleDeleteCancel,
    handleDeleteStart, handlePasswordConfirm, handlePasswordCancel,
  } = useFileDeleteFlow({ file })

  const handleDownload = async () => {
    const keyHex = useGlobalStore.getState().cryptoContext?.vaultKey
    if (!keyHex) {
      console.error("[FileDetail] No vault key available")
      return
    }
    const keyStr = Array.from(keyHex).map(b => b.toString(16).padStart(2, '0')).join('')
    await download(file.id, keyStr)
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl flex items-center gap-2">
            <File className="h-5 w-5" />
            {file.fileName || t("files.detail.untitled", { defaultValue: "File" })}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Download className="h-4 w-4 mr-1" />
              )}
              {downloading
                ? `${progress.percent}%`
                : t("files.detail.download", { defaultValue: "Download" })}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {t("files.detail.delete", { defaultValue: "Delete" })}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[var(--muted-foreground)]">{t("files.detail.size", { defaultValue: "Size" })}</p>
              <p>{formatFileSize(file.size)}</p>
            </div>
            <div>
              <p className="text-[var(--muted-foreground)]">{t("files.detail.status", { defaultValue: "Status" })}</p>
              <p className="capitalize">{file.status}</p>
            </div>
            <div>
              <p className="text-[var(--muted-foreground)]">{t("files.detail.chunks", { defaultValue: "Chunks" })}</p>
              <p>{file.chunkCount}</p>
            </div>
            {file.mimeType && (
              <div>
                <p className="text-[var(--muted-foreground)]">{t("files.detail.type", { defaultValue: "Type" })}</p>
                <p>{file.mimeType}</p>
              </div>
            )}
          </div>

          {file.createdAt && (
            <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] pt-4 border-t border-[var(--border)]">
              <Clock className="h-3.5 w-3.5" />
              {t("files.detail.createdAt", { defaultValue: "Created" })}:{" "}
              {new Date(file.createdAt).toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>

      {deleteDialog && (
        <DeleteConfirmDialog
          title={t("files.delete.title", { defaultValue: "Delete file" })}
          message={t("files.delete.message", { defaultValue: "Are you sure you want to delete this file? This action cannot be undone." })}
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
    </div>
  )
}
