import { useTranslation } from "react-i18next"
import { Search } from "lucide-react"
import { useAppDispatch, useAppState } from "@/app/context/AppContext"
import { Input } from "@/app/components/ui/input"

export function SidebarHeader() {
  const { t } = useTranslation()
  const { searchQuery } = useAppState()
  const dispatch = useAppDispatch()

  const handleChange = (value: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", query: value })
  }

  return (
    <div className="p-3 border-b border-[var(--border)]">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2 px-1">
        {t("app.sidebar.vaults")}
      </h2>
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
  )
}
