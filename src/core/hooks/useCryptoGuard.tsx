import { useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { MasterPasswordDialog } from "@/app/components/ui/MasterPasswordDialog"
import { regenerateKeys, signChallenge } from "@/core/services/crypto"
import { challengeStart, challengeFinish } from "@/core/services/api/endpoints/auth"
import { storage } from "@/core/storage"
import { useGlobalStore } from "@/core/store/useGlobalStore"

interface UseCryptoGuardReturn {
  /** True if crypto context is ready (vaultKey available) */
  ready: boolean
  /** Call this to request unlock - shows password dialog if needed */
  requestUnlock: () => void
  /** True if password dialog is currently showing */
  isUnlocking: boolean
  /** Password dialog component - render this when isUnlocking is true */
  PasswordDialog: React.ReactNode | null
}


export function useCryptoGuard(): UseCryptoGuardReturn {
  const { t } = useTranslation()
  const cryptoContext = useGlobalStore((state) => state.cryptoContext)
  const clearKeys = useGlobalStore((state) => state.clearKeys)
  const [isUnlocking, setIsUnlocking] = useState(false)

  const ready = !!cryptoContext?.vaultKey

  const requestUnlock = useCallback(() => {
    if (ready) return
    setIsUnlocking(true)
  }, [ready])

  const handlePasswordConfirm = useCallback(
    async (password: string) => {
      console.log("[CryptoGuard] Starting password verification...")

      // Step 1: Get salt from storage
      const data = await storage.get<{ salt: string }>("sensitive_data")
      if (!data?.salt) {
        console.error("[CryptoGuard] No salt found in storage")
        throw new Error(t("errors.noSalt", { defaultValue: "No salt found" }))
      }
      console.log("[CryptoGuard] Salt retrieved from storage")

      // Step 2: Derive keys locally
      console.log("[CryptoGuard] Deriving keys from password...")
      await regenerateKeys(password, data.salt)
      console.log("[CryptoGuard] Keys derived successfully")

      // Step 3: Verify with server - get challenge
      console.log("[CryptoGuard] Requesting challenge from server...")
      const challengeResult = await challengeStart()
      if (!challengeResult.status) {
        console.error("[CryptoGuard] Failed to get challenge from server")
        clearKeys()
        throw new Error(t("errors.challengeFailed", { defaultValue: "Failed to verify password" }))
      }
      console.log("[CryptoGuard] Challenge received:", challengeResult.response.challenge.substring(0, 20) + "...")

      // Step 4: Sign the challenge with derived private key
      console.log("[CryptoGuard] Signing challenge with private key...")
      const signature = await signChallenge(challengeResult.response.challenge)
      if (!signature) {
        console.error("[CryptoGuard] Failed to sign challenge - no signing keys available")
        clearKeys()
        throw new Error(t("errors.invalidPassword", { defaultValue: "Invalid master password" }))
      }
      console.log("[CryptoGuard] Challenge signed successfully")

      // Step 5: Send signature to server for verification
      console.log("[CryptoGuard] Sending signature to server for verification...")
      const verifyResult = await challengeFinish({ signedChallenge: signature })
      console.log("[CryptoGuard] Server response:", verifyResult)

      if (!verifyResult.status) {
        // Server rejected - wrong password, clear incorrectly derived keys
        console.error("[CryptoGuard] Server rejected signature - wrong password")
        clearKeys()
        throw new Error(t("errors.invalidPassword", { defaultValue: "Invalid master password" }))
      }

      // Step 6: Server confirmed - keys are valid
      console.log("[CryptoGuard] Server confirmed - keys are valid!")
      setIsUnlocking(false)
    },
    [t, clearKeys]
  )

  const handleCancel = useCallback(() => {
    setIsUnlocking(false)
  }, [])

  const PasswordDialog = isUnlocking ? (
    <MasterPasswordDialog
      title={t("app.masterPassword.title")}
      onConfirm={handlePasswordConfirm}
      onCancel={handleCancel}
    />
  ) : null

  return {
    ready,
    requestUnlock,
    isUnlocking,
    PasswordDialog,
  }
}
