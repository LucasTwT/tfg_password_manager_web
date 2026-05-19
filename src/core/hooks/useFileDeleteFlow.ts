import { useState, useCallback } from "react"
import { useAppDispatch } from "@/app/context/AppContext"
import { regenerateKeys, signChallenge } from "@/core/services/crypto"
import { startDeleteFile, finishDeleteFile } from "@/core/services/api/endpoints/files"
import { storage } from "@/core/storage"
import type { VaultFile } from "@/core/types/file"

interface UseFileDeleteFlowOptions {
  file: VaultFile
}

interface UseFileDeleteFlowReturn {
  deleteDialog: boolean
  passwordDialog: boolean
  deleting: boolean
  handleDeleteConfirm: () => void
  handleDeleteCancel: () => void
  handleDeleteStart: () => Promise<void>
  handlePasswordConfirm: (password: string) => Promise<void>
  handlePasswordCancel: () => void
}

export function useFileDeleteFlow({ file }: UseFileDeleteFlowOptions): UseFileDeleteFlowReturn {
  const dispatch = useAppDispatch()
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [passwordDialog, setPasswordDialog] = useState(false)
  const [pendingDeleteChallenge, setPendingDeleteChallenge] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDeleteConfirm = useCallback(() => {
    setDeleteDialog(true)
  }, [])

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialog(false)
  }, [])

  const handleDeleteStart = useCallback(async () => {
    setDeleting(true)
    try {
      const startResult = await startDeleteFile()
      if (!startResult.status) return

      const challenge = startResult.response?.challenge
      if (!challenge) return

      const signature = await signChallenge(challenge)
      if (!signature) {
        setPendingDeleteChallenge(challenge)
        setPasswordDialog(true)
        setDeleteDialog(false)
        return
      }

      const result = await finishDeleteFile(file.id, signature)
      if (result.status) {
        setDeleteDialog(false)
        dispatch({ type: "CLOSE_TAB", tabId: file.id })
        window.dispatchEvent(new CustomEvent("file-deleted", { detail: { vaultId: file.vaultId, fileId: file.id } }))
      }
    } finally {
      setDeleting(false)
    }
  }, [file, dispatch])

  const handlePasswordConfirm = useCallback(
    async (password: string) => {
      if (!pendingDeleteChallenge) return

      const data = await storage.get<{ salt: string }>("sensitive_data")
      if (!data?.salt) throw new Error("No salt found")

      await regenerateKeys(password, data.salt)
      const signature = await signChallenge(pendingDeleteChallenge)
      if (!signature) throw new Error("Failed to sign challenge")

      const result = await finishDeleteFile(file.id, signature)
      if (result.status) {
        setPasswordDialog(false)
        setPendingDeleteChallenge(null)
        dispatch({ type: "CLOSE_TAB", tabId: file.id })
        window.dispatchEvent(new CustomEvent("file-deleted", { detail: { vaultId: file.vaultId, fileId: file.id } }))
      }
    },
    [pendingDeleteChallenge, file, dispatch]
  )

  const handlePasswordCancel = useCallback(() => {
    setPasswordDialog(false)
    setPendingDeleteChallenge(null)
  }, [])

  return {
    deleteDialog,
    passwordDialog,
    deleting,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleDeleteStart,
    handlePasswordConfirm,
    handlePasswordCancel,
  }
}
