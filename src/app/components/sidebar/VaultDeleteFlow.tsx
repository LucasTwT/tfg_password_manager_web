import { useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { DeleteConfirmDialog } from "@/app/components/ui/DeleteConfirmDialog"
import { MasterPasswordDialog } from "@/app/components/ui/MasterPasswordDialog"
import { regenerateKeys, signChallenge } from "@/core/services/crypto"
import { storage } from "@/core/storage"

interface VaultDeleteFlowProps {
  vaultId: string
  onDelete: (signature: string) => Promise<boolean>
  onComplete: () => void
}

export function VaultDeleteFlow({ vaultId, onDelete, onComplete }: VaultDeleteFlowProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState<"confirm" | "password">("confirm")
  const [pendingChallenge, setPendingChallenge] = useState<string | null>(null)

  const handleDeleteStart = useCallback(async () => {
    const { startDeleteVault } = await import("@/core/services/api/endpoints/vaults")
    const { signChallenge } = await import("@/core/services/crypto")

    const startResult = await startDeleteVault()
    if (!startResult.status) return

    const challenge = startResult.response?.challenge
    if (!challenge) return

    const signature = await signChallenge(challenge)
    if (!signature) {
      setPendingChallenge(challenge)
      setStep("password")
      return
    }

    const ok = await onDelete(signature)
    if (ok) onComplete()
  }, [onDelete, onComplete])

  const handlePasswordConfirm = useCallback(
    async (password: string) => {
      if (!pendingChallenge) return

      const data = await storage.get<{ salt: string }>("sensitive_data")
      if (!data?.salt) throw new Error("No salt found")

      await regenerateKeys(password, data.salt)
      const signature = await signChallenge(pendingChallenge)
      if (!signature) throw new Error("Failed to sign challenge")

      const ok = await onDelete(signature)
      if (ok) {
        setPendingChallenge(null)
        onComplete()
      }
    },
    [pendingChallenge, onDelete, onComplete]
  )

  if (step === "confirm") {
    return (
      <DeleteConfirmDialog
        title={t("vaults.delete.title")}
        message={t("vaults.delete.message")}
        onConfirm={handleDeleteStart}
        onCancel={onComplete}
      />
    )
  }

  return (
    <MasterPasswordDialog
      title={t("app.masterPassword.title")}
      onConfirm={handlePasswordConfirm}
      onCancel={() => {
        setPendingChallenge(null)
        onComplete()
      }}
    />
  )
}
