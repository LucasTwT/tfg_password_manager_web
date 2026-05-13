import { useState, useCallback } from "react"
import { useAppDispatch } from "@/app/context/AppContext"
import { regenerateKeys, signChallenge } from "@/core/services/crypto"
import { startDeleteLogin, finishDeleteLogin } from "@/core/services/api/endpoints/logins"
import { storage } from "@/core/storage"
import type { Login } from "@/core/types/login"

interface UseLoginDeleteFlowOptions {
  login: Login
}

interface UseLoginDeleteFlowReturn {
  deleteDialog: boolean
  passwordDialog: boolean
  deleting: boolean
  handleDeleteConfirm: () => void
  handleDeleteCancel: () => void
  handleDeleteStart: () => Promise<void>
  handlePasswordConfirm: (password: string) => Promise<void>
  handlePasswordCancel: () => void
}

export function useLoginDeleteFlow({ login }: UseLoginDeleteFlowOptions): UseLoginDeleteFlowReturn {
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
      const startResult = await startDeleteLogin()
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

      const result = await finishDeleteLogin(login.vaultId, login.id, signature)
      if (result.status) {
        setDeleteDialog(false)
        dispatch({ type: "CLOSE_TAB", tabId: login.id })
        window.dispatchEvent(new CustomEvent("login-deleted", { detail: { vaultId: login.vaultId, loginId: login.id } }))
      }
    } finally {
      setDeleting(false)
    }
  }, [login, dispatch])

  const handlePasswordConfirm = useCallback(
    async (password: string) => {
      if (!pendingDeleteChallenge) return

      const data = await storage.get<{ salt: string }>("sensitive_data")
      if (!data?.salt) throw new Error("No salt found")

      await regenerateKeys(password, data.salt)
      const signature = await signChallenge(pendingDeleteChallenge)
      if (!signature) throw new Error("Failed to sign challenge")

      const result = await finishDeleteLogin(login.vaultId, login.id, signature)
      if (result.status) {
        setPasswordDialog(false)
        setPendingDeleteChallenge(null)
        dispatch({ type: "CLOSE_TAB", tabId: login.id })
        window.dispatchEvent(new CustomEvent("login-deleted", { detail: { vaultId: login.vaultId, loginId: login.id } }))
      }
    },
    [pendingDeleteChallenge, login, dispatch]
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
