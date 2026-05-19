import { useState, useEffect, useCallback } from "react"
import type { VaultFile } from "@/core/types/file"

interface UseVaultFilesOptions {
  enabled: boolean
  vaultId: string
  loadFiles: (vaultId: string) => Promise<VaultFile[]>
  onLoaded?: (files: VaultFile[]) => void
  onLoadingChange?: (loading: boolean) => void
}

interface UseVaultFilesReturn {
  files: VaultFile[]
  loading: boolean
  reload: () => Promise<void>
  addFile: (file: VaultFile) => void
  removeFile: (id: string) => void
  clear: () => void
}

export function useVaultFiles({
  enabled,
  vaultId,
  loadFiles,
  onLoaded,
  onLoadingChange,
}: UseVaultFilesOptions): UseVaultFilesReturn {
  const [files, setFilesState] = useState<VaultFile[]>([])
  const [loading, setLoadingState] = useState(false)

  useEffect(() => {
    if (!enabled) {
      console.log("[useVaultFiles] Hook disabled, skipping load")
      return
    }

    console.log(`[useVaultFiles] Enabled=true, loading files for vault ${vaultId}`)
    let cancelled = false

    const load = async () => {
      setLoadingState(true)
      onLoadingChange?.(true)

      try {
        const data = await loadFiles(vaultId)
        console.log(`[useVaultFiles] Loaded ${data.length} files, cancelled=${cancelled}`)
        if (!cancelled) {
          setFilesState(data)
          onLoaded?.(data)
        }
      } finally {
        if (!cancelled) {
          setLoadingState(false)
          onLoadingChange?.(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [enabled, vaultId, loadFiles, onLoaded, onLoadingChange])

  const reload = useCallback(async () => {
    console.log("[useVaultFiles.reload] Manual reload triggered")
    setLoadingState(true)
    onLoadingChange?.(true)

    try {
      const data = await loadFiles(vaultId)
      setFilesState(data)
      onLoaded?.(data)
    } finally {
      setLoadingState(false)
      onLoadingChange?.(false)
    }
  }, [vaultId, loadFiles, onLoaded, onLoadingChange])

  const addFile = useCallback((file: VaultFile) => {
    setFilesState((prev) => [...prev, file])
  }, [])

  const removeFile = useCallback((id: string) => {
    setFilesState((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const clear = useCallback(() => {
    setFilesState([])
  }, [])

  return { files, loading, reload, addFile, removeFile, clear }
}
