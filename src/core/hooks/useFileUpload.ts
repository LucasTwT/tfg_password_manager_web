import { useState, useCallback } from "react"
import sodium from "libsodium-wrappers"
import { ensureSodiumReady, readEncryptFileChunks, encryptXChaCha, hexToUint8 } from "@/core/services/crypto"
import { initFileUpload, uploadFileChunk, completeFileUpload } from "@/core/services/api/endpoints/files"
import type { FileUploadProgress } from "@/core/types/file"
import type { VaultFile } from "@/core/types/file"

interface UseFileUploadReturn {
  upload: (file: File, vaultId: string, keyHex: string) => Promise<VaultFile | null>
  progress: FileUploadProgress
  uploading: boolean
  error: string | null
}

export function useFileUpload(): UseFileUploadReturn {
  const [progress, setProgress] = useState<FileUploadProgress>({ current: 0, total: 0, percent: 0 })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(async (file: File, vaultId: string, keyHex: string): Promise<VaultFile | null> => {
    console.log("[useFileUpload] Starting upload", { fileName: file.name, size: file.size, vaultId })
    setUploading(true)
    setError(null)
    setProgress({ current: 0, total: 0, percent: 0 })

    try {
      await ensureSodiumReady()

      // Calculate total chunks
      const CHUNK_SIZE = 64 * 1024
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
      console.log(`[useFileUpload] Total chunks: ${totalChunks}`)

      // Encrypt metadata
      const metadata = JSON.stringify({ fileName: file.name, mimeType: file.type || "application/octet-stream" })
      const keyUint8 = hexToUint8(keyHex)
      const { ciphertext: cipherMetadata, nonce: metadataNonce } = await encryptXChaCha(metadata, keyUint8)

      // Init upload
      const initResult = await initFileUpload(vaultId, {
        cipher_metadata: cipherMetadata,
        metadata_nonce: metadataNonce,
        size: file.size,
      })

      if (!initResult.status || !initResult.response?.upload_id) {
        const errMsg = initResult.error || "Failed to init upload"
        console.error("[useFileUpload] Init failed", errMsg)
        setError(errMsg)
        return null
      }

      const uploadId = initResult.response.upload_id
      console.log(`[useFileUpload] Upload initialized, uploadId: ${uploadId}`)

      // Upload chunks
      let chunkIndex = 0
      for await (const chunk of readEncryptFileChunks(file, keyHex)) {
        const sodiumChunk = {
          seq: chunk.index,
          offset: chunk.offset,
          length: CHUNK_SIZE,
          nonce: sodium.to_base64(chunk.nonce),
          ciphertext: sodium.to_base64(chunk.ciphertext),
        }

        const chunkResult = await uploadFileChunk(uploadId, sodiumChunk)
        if (!chunkResult.status) {
          const errMsg = chunkResult.error || `Failed to upload chunk ${chunk.index}`
          console.error("[useFileUpload] Chunk upload failed", errMsg)
          setError(errMsg)
          return null
        }

        chunkIndex++
        setProgress({
          current: chunkIndex,
          total: totalChunks,
          percent: Math.round((chunkIndex / totalChunks) * 100),
        })
      }

      // Complete upload
      console.log("[useFileUpload] All chunks uploaded, completing...")
      const completeResult = await completeFileUpload(uploadId)
      if (!completeResult.status) {
        const errMsg = completeResult.error || "Failed to complete upload"
        console.error("[useFileUpload] Complete failed", errMsg)
        setError(errMsg)
        return null
      }

      console.log("[useFileUpload] Upload complete!", completeResult.response)
      const newFile: VaultFile = {
        id: completeResult.response.file_id || uploadId,
        vaultId,
        cipherMetadata: cipherMetadata,
        metadataNonce: metadataNonce,
        size: file.size,
        status: "complete",
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        chunkCount: totalChunks,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
      }

      return newFile
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Upload failed"
      console.error("[useFileUpload] Exception", err)
      setError(errMsg)
      return null
    } finally {
      setUploading(false)
    }
  }, [])

  return { upload, progress, uploading, error }
}
