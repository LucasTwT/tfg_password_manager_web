import { useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Plus, Search } from "lucide-react"
import { useAppDispatch, useAppState } from "@/app/context/AppContext"
import { Input } from "@/app/components/ui/input"
import { VaultFormModal } from "@/app/components/vaults/VaultFormModal"
import { useVaultActions } from "@/core/hooks/useVaultActions"
import type { VaultConfig } from "@/core/types/vault"

export function SidebarHeader() {
  const { t } = useTranslation()
  const { searchQuery } = useAppState()
  const dispatch = useAppDispatch()
  const { createVault } = useVaultActions()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleChange = (value: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", query: value })
  }

  const handleCreateSave = useCallback(
    async (name: string, config: VaultConfig) => {
      const success = await createVault(name, config)
      if (success) setShowCreateModal(false)
    },
    [createVault]
  )

  return (
    <>
      <div className="p-3 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            {t("app.sidebar.vaults")}
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center w-5 h-5 rounded hover:bg-[var(--accent)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            title={t("vaults.create.title")}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
          <Input
            value={searchQuery}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={t("app.sidebar.search.placeholder")}
            className="pl-8 h-9 text-sm"
          />
        </div>
      </div>

      {showCreateModal && (
        <VaultFormModal
          mode="create"
          onSave={handleCreateSave}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </>
  )
}
