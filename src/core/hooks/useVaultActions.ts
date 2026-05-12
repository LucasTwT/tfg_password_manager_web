import { useCallback } from "react"
import type { Vault, VaultConfig } from "@/core/types/vault"
import {
  requestCreateVault,
  requestModifyVault,
  getVaults,
  startDeleteVault,
  finishDeleteVault,
} from "@/core/services/api/endpoints/vaults"
import { signChallenge } from "@/core/services/crypto"
import { useAppStore } from "@/core/store/useAppStore"

export function useVaultActions() {
  const addVault = useAppStore((s) => s.addVault)
  const modifyVaultStore = useAppStore((s) => s.modifyVault)
  const initUserVaults = useAppStore((s) => s.initUserVaults)

  const loadVaults = useCallback(async (): Promise<void> => {
    const { status, response } = await getVaults()
    if (status === 200) {
      initUserVaults(response.vaults)
    }
  }, [initUserVaults])

  const createVault = useCallback(
    async (name: string, config: VaultConfig): Promise<boolean> => {
      const placeholder: Vault = {
        id: "",
        name,
        settings: config,
        created_at: "",
        updated_at: "",
      }

      const { status } = await requestCreateVault(placeholder)
      if (status === 201) {
        // Refresh full list to get server-generated id and timestamps
        const result = await getVaults()
        if (result.status === 200) {
          initUserVaults(result.response.vaults)
        }
        return true
      }
      return false
    },
    [initUserVaults]
  )

  const modifyVault = useCallback(
    async (vault: Vault): Promise<boolean> => {
      const { status } = await requestModifyVault(vault)
      if (status === 202) {
        modifyVaultStore(vault)
        return true
      }
      return false
    },
    [modifyVaultStore]
  )

  const deleteVault = useCallback(
    async (vaultId: string): Promise<{ success: boolean; needPassword?: boolean }> => {
      // Step 1: start delete flow → get challenge
      const startResult = await startDeleteVault()
      if (!startResult.status) return { success: false }

      const challenge = startResult.response?.challenge
      if (!challenge) return { success: false }

      // Step 2: sign the challenge — needs crypto context (keys)
      const signature = await signChallenge(challenge)
      if (!signature) {
        // Crypto context not available — need master password
        return { success: false, needPassword: true }
      }

      // Step 3: finish delete
      const finishResult = await finishDeleteVault(signature, vaultId)
      return { success: !!finishResult.status }
    },
    []
  )

  return { createVault, modifyVault, deleteVault, loadVaults }
}
