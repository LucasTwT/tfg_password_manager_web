import { useState, useCallback } from "react"
import { ensureSodiumReady, decryptXChaCha, decryptChunkXChaCha, hexToUint8 } from "@/core/services/crypto"
import { getFileMetadata, getFileChunks } from "@/core/services/api/endpoints/files"
import type { FileUploadProgress } from "@/core/types/file"

interface UseFileDownloadReturn {
  download: (fileId: string, keyHex: string) => Promise<void>
  getBlob: (fileId: string, keyHex: string) => Promise<{ blob: Blob; fileName: string; mimeType: string } | null>
  progress: FileUploadProgress
  downloading: boolean
  error: string | null
}

export function useFileDownload(): UseFileDownloadReturn {
  const [progress, setProgress] = useState<FileUploadProgress>({ current: 0, total: 0, percent: 0 })
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getBlob = useCallback(async (fileId: string, keyHex: string): Promise<{ blob: Blob; fileName: string; mimeType: string } | null> => {
    console.log("[useFileDownload] Starting blob build", { fileId })
    setDownloading(true)
    setError(null)
    setProgress({ current: 0, total: 0, percent: 0 })

    try {
      await ensureSodiumReady()

      const metaResult = await getFileMetadata(fileId)
      if (!metaResult.status || !metaResult.response) {
        const errMsg = metaResult.error || "Failed to get file metadata"
        console.error("[useFileDownload] Metadata failed", errMsg)
        setError(errMsg)
        return null
      }

      const fileMeta = metaResult.response
      console.log("[useFileDownload] Got metadata", { chunkCount: fileMeta.chunk_count })

      const keyUint8 = hexToUint8(keyHex)
      let fileName = "download"
      let mimeType = "application/octet-stream"

      try {
        const decryptedMeta = await decryptXChaCha(
          fileMeta.cipher_metadata,
          fileMeta.metadata_nonce,
          keyUint8
        )
        const meta = JSON.parse(decryptedMeta)
        fileName = meta.fileName || fileName
        mimeType = meta.mimeType || mimeType
        console.log("[useFileDownload] Decrypted metadata", { fileName, mimeType })
      } catch (metaErr) {
        console.warn("[useFileDownload] Failed to decrypt metadata, using defaults", metaErr)
      }

      const chunksResult = await getFileChunks(fileId)
      if (!chunksResult.status || !chunksResult.response?.chunks) {
        const errMsg = chunksResult.error || "Failed to get file chunks"
        console.error("[useFileDownload] Chunks failed", errMsg)
        setError(errMsg)
        return null
      }

      const chunks = chunksResult.response.chunks
      const totalChunks = chunks.length
      console.log(`[useFileDownload] Got ${totalChunks} chunks`)

      const parts: Uint8Array[] = []
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]
        const plaintext = decryptChunkXChaCha(chunk.ciphertext, chunk.nonce, keyHex)
        parts.push(plaintext)

        setProgress({
          current: i + 1,
          total: totalChunks,
          percent: Math.round(((i + 1) / totalChunks) * 100),
        })
      }

      const blob = new Blob(parts, { type: mimeType })
      return { blob, fileName, mimeType }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Download failed"
      console.error("[useFileDownload] Exception", err)
      setError(errMsg)
      return null
    } finally {
      setDownloading(false)
    }
  }, [])

  const download = useCallback(async (fileId: string, keyHex: string): Promise<void> => {
    const result = await getBlob(fileId, keyHex)
    if (!result) return

    const { blob, fileName } = result
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [getBlob])

  return { download, getBlob, progress, downloading, error }
}
