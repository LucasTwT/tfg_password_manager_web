import { useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Plus } from "lucide-react"
import { useAppStore } from "@/core/store/useAppStore"
import { useAppState } from "@/app/context/AppContext"
import { VaultItem } from "./VaultItem"
import { filterVaultsByQuery } from "./filterVaults"
import { ContextMenu, type ContextMenuItem } from "@/app/components/ui/ContextMenu"
import { VaultFormModal } from "@/app/components/vaults/VaultFormModal"
import { useVaultActions } from "@/core/hooks/useVaultActions"
import type { VaultConfig } from "@/core/types/vault"

export function VaultList() {
  const { t } = useTranslation()
  const { userVaults } = useAppStore()
  const { searchQuery } = useAppState()
  const { createVault } = useVaultActions()
  const filtered = filterVaultsByQuery(userVaults, searchQuery)

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    // Only show on the background, not on vault items
    if (e.target === e.currentTarget) {
      e.preventDefault()
      setContextMenu({ x: e.clientX, y: e.clientY })
    }
  }, [])

  const handleCreateSave = useCallback(
    async (name: string, config: VaultConfig) => {
      const success = await createVault(name, config)
      if (success) setShowCreateModal(false)
    },
    [createVault]
  )

  const contextMenuItems: ContextMenuItem[] = [
    {
      label: t("vaults.create.title"),
      icon: <Plus className="h-3.5 w-3.5" />,
      onClick: () => setShowCreateModal(true),
    },
  ]

  return (
    <>
      <div
        className="flex-1 overflow-y-auto py-1"
        onContextMenu={handleContextMenu}
      >
        {filtered.map((vault) => (
          <VaultItem key={vault.id} vault={vault} />
        ))}
        {filtered.length === 0 && searchQuery && (
          <div className="p-4 text-center">
            <p className="text-sm text-[var(--muted-foreground)]">
              {t("app.sidebar.noVaults")}
            </p>
          </div>
        )}
      </div>

      {contextMenu && (
        <ContextMenu
          items={contextMenuItems}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}

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
