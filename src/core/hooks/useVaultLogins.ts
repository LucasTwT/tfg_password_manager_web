import { useState, useEffect, useCallback } from "react"
import type { Login } from "@/core/types/login"

/**
 * useVaultLogins - Custom hook for managing vault login data
 * Handles loading, caching, and refreshing logins for a vault
 */

interface UseVaultLoginsOptions {
  /** Whether to auto-load logins when enabled */
  enabled: boolean
  /** Vault ID to load logins for */
  vaultId: string
  /** Function to load logins from API */
  loadLogins: (vaultId: string) => Promise<Login[]>
  /** Callback when logins are loaded */
  onLoaded?: (logins: Login[]) => void
  /** Callback when loading state changes */
  onLoadingChange?: (loading: boolean) => void
}

interface UseVaultLoginsReturn {
  /** Current list of logins */
  logins: Login[]
  /** Whether logins are currently loading */
  loading: boolean
  /** Manually trigger reload of logins */
  reload: () => Promise<void>
  /** Add a login to the local list */
  addLogin: (login: Login) => void
  /** Update a login in the local list */
  updateLogin: (id: string, updates: Partial<Login>) => void
  /** Remove a login from the local list */
  removeLogin: (id: string) => void
  /** Clear all logins */
  clear: () => void
}

export function useVaultLogins({
  enabled,
  vaultId,
  loadLogins,
  onLoaded,
  onLoadingChange,
}: UseVaultLoginsOptions): UseVaultLoginsReturn {
  const [logins, setLoginsState] = useState<Login[]>([])
  const [loading, setLoadingState] = useState(false)

  // Load logins when vault is expanded
  useEffect(() => {
    if (!enabled) {
      console.log("[useVaultLogins] Hook disabled, skipping load")
      return
    }

    console.log(`[useVaultLogins] Enabled=true, loading logins for vault ${vaultId}`)
    let cancelled = false

    const load = async () => {
      setLoadingState(true)
      onLoadingChange?.(true)

      try {
        const data = await loadLogins(vaultId)
        console.log(`[useVaultLogins] Loaded ${data.length} logins, cancelled=${cancelled}`)
        if (!cancelled) {
          setLoginsState(data)
          onLoaded?.(data)
          console.log(`[useVaultLogins] State updated and onLoaded called with ${data.length} logins`)
        } else {
          console.warn("[useVaultLogins] Load cancelled, skipping state update")
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
      console.log("[useVaultLogins] Cleanup: marked load as cancelled")
    }
  }, [enabled, vaultId, loadLogins, onLoaded, onLoadingChange])

  /** Reload logins from API */
  const reload = useCallback(async () => {
    console.log("[useVaultLogins.reload] Manual reload triggered")
    setLoadingState(true)
    onLoadingChange?.(true)

    try {
      const data = await loadLogins(vaultId)
      console.log(`[useVaultLogins.reload] Reloaded ${data.length} logins`)
      setLoginsState(data)
      onLoaded?.(data)
    } finally {
      setLoadingState(false)
      onLoadingChange?.(false)
    }
  }, [vaultId, loadLogins, onLoaded, onLoadingChange])

  /** Add a login to local state */
  const addLogin = useCallback((login: Login) => {
    setLoginsState((prev) => [...prev, login])
  }, [])

  /** Update a login in local state */
  const updateLogin = useCallback((id: string, updates: Partial<Login>) => {
    setLoginsState((prev) =>
      prev.map((login) => (login.id === id ? { ...login, ...updates } : login))
    )
  }, [])

  /** Remove a login from local state */
  const removeLogin = useCallback((id: string) => {
    setLoginsState((prev) => prev.filter((login) => login.id !== id))
  }, [])

  /** Clear all logins */
  const clear = useCallback(() => {
    setLoginsState([])
  }, [])

  return {
    logins,
    loading,
    reload,
    addLogin,
    updateLogin,
    removeLogin,
    clear,
  }
}
