export interface VaultFile {
  id: string
  vaultId: string
  cipherMetadata: string
  metadataNonce: string
  size: number
  status: "uploading" | "complete" | "failed"
  createdAt: string
  completedAt: string | null
  chunkCount: number
  // Decrypted fields (populated after decryption)
  fileName?: string
  mimeType?: string
}

export interface FileUploadProgress {
  current: number
  total: number
  percent: number
}
