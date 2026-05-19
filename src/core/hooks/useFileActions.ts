import { useCallback } from "react"
import { decryptXChaCha } from "@/core/services/crypto"
import { listFilesByVault } from "@/core/services/api/endpoints/files"
import { useGlobalStore } from "@/core/store/useGlobalStore"
import type { VaultFile } from "@/core/types/file"

interface EncryptedFilePayload {
  id: string
  vault_id: string
  cipher_metadata: string
  metadata_nonce: string
  size: number
  status: string
  created_at: string
  completed_at: string | null
  chunk_count: number
}

function getVaultKey(): Uint8Array<ArrayBufferLike> | null {
  return useGlobalStore.getState().cryptoContext?.vaultKey ?? null
}

export function useFileActions() {
  const loadFiles = useCallback(async (vaultId: string): Promise<VaultFile[]> => {
    console.log(`[loadFiles] Starting load for vault ${vaultId}`)
    const vaultKey = getVaultKey()
    if (!vaultKey) {
      console.warn("[loadFiles] Vault key is null, returning empty array")
      return []
    }

    const { status, response } = await listFilesByVault(vaultId)
    if (!status) {
      console.warn(`[loadFiles] API returned non-ok status for vault ${vaultId}`)
      return []
    }

    const encryptedFiles: EncryptedFilePayload[] = response.files ?? []
    console.log(`[loadFiles] Loaded ${encryptedFiles.length} files from API`)

    const decrypted: VaultFile[] = await Promise.all(
      encryptedFiles.map(async (enc) => {
        let fileName = "File"
        let mimeType = "application/octet-stream"

        try {
          const plaintext = await decryptXChaCha(enc.cipher_metadata, enc.metadata_nonce, vaultKey)
          const meta = JSON.parse(plaintext)
          fileName = meta.fileName || fileName
          mimeType = meta.mimeType || mimeType
        } catch {
          console.warn(`[loadFiles] Failed to decrypt metadata for file ${enc.id}`)
        }

        return {
          id: enc.id,
          vaultId: enc.vault_id,
          cipherMetadata: enc.cipher_metadata,
          metadataNonce: enc.metadata_nonce,
          size: enc.size,
          status: enc.status as VaultFile["status"],
          createdAt: enc.created_at ?? "",
          completedAt: enc.completed_at ?? null,
          chunkCount: enc.chunk_count ?? 0,
          fileName,
          mimeType,
        }
      })
    )

    console.log(`[loadFiles] Decrypted ${decrypted.length} files successfully`)
    return decrypted
  }, [])

  return { loadFiles }
}
