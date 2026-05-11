import { useTranslation } from "react-i18next"
import { ChevronRight, Shield } from "lucide-react"
import { useAppDispatch, useAppState } from "@/app/context/AppContext"
import { cn } from "@/utils/cn"
import type { Vault } from "@/core/types/vault"
import { LoginItem } from "./LoginItem"

interface VaultItemProps {
  vault: Vault
}

export function VaultItem({ vault }: VaultItemProps) {
  const { t } = useTranslation()
  const { expandedVaultIds, activeVaultId } = useAppState()
  const dispatch = useAppDispatch()
  const isExpanded = expandedVaultIds.has(vault.id)
  const isActive = activeVaultId === vault.id

  const handleToggle = () => {
    dispatch({ type: "TOGGLE_VAULT_EXPAND", vaultId: vault.id })
    dispatch({ type: "SELECT_VAULT", vaultId: vault.id })
  }

  const logins: { id: string; title: string }[] = []

  return (
    <div className="px-1.5">
      <button
        onClick={handleToggle}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer",
          "hover:bg-[var(--accent)]",
          isActive && "bg-[var(--accent)]"
        )}
      >
        <div
          className="flex items-center justify-center w-6 h-6 rounded text-xs shrink-0"
          style={{
            backgroundColor: vault.settings?.colors?.bgColor || "var(--primary)",
            color: vault.settings?.colors?.icColor || "var(--primary-foreground)",
          }}
        >
          <Shield className="h-3.5 w-3.5" />
        </div>
        <span className="flex-1 text-left truncate text-[var(--foreground)]">
          {vault.name}
        </span>
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 text-[var(--muted-foreground)] transition-transform duration-150",
            isExpanded && "rotate-90"
          )}
        />
      </button>

      {isExpanded && (
        <div className="ml-4 border-l border-[var(--border)] pl-2 py-0.5">
          {logins.length > 0 ? (
            logins.map((login) => (
              <LoginItem
                key={login.id}
                login={{
                  id: login.id,
                  vaultId: vault.id,
                  title: login.title,
                  username: "",
                  email: "",
                  password: "",
                  url: "",
                  notes: "",
                  created_at: "",
                  updated_at: "",
                }}
              />
            ))
          ) : (
            <p className="px-2 py-1.5 text-xs text-[var(--muted-foreground)]">
              {t("app.sidebar.noLogins")}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
