import { useTranslation } from "react-i18next"
import { useAppStore } from "@/core/store/useAppStore"
import { useAppState } from "@/app/context/AppContext"
import { VaultItem } from "./VaultItem"
import { filterVaultsByQuery } from "./filterVaults"

export function VaultList() {
  const { t } = useTranslation()
  const { userVaults } = useAppStore()
  const { searchQuery } = useAppState()
  const filtered = filterVaultsByQuery(userVaults, searchQuery)

  if (userVaults.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-sm text-[var(--muted-foreground)] text-center">
          {t("app.sidebar.noVaults")}
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto py-1">
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
  )
}
