import { useTranslation } from "react-i18next"
import { X, KeyRound, FileText } from "lucide-react"
import { cn } from "@/utils/cn"
import type { Tab as TabType } from "@/app/context/AppContext"

interface TabProps {
  tab: TabType
  isActive: boolean
  onSelect: () => void
  onClose: () => void
}

export function Tab({ tab, isActive, onSelect, onClose }: TabProps) {
  const { t } = useTranslation()

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose()
  }

  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 text-sm border-r border-[var(--border)] transition-colors cursor-pointer min-w-0 shrink-0",
        isActive
          ? "bg-[var(--background)] text-[var(--foreground)]"
          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]"
      )}
    >
      {tab.type === "login" ? (
        <KeyRound className="h-3.5 w-3.5 shrink-0" />
      ) : (
        <FileText className="h-3.5 w-3.5 shrink-0" />
      )}
      <span className="truncate max-w-[120px]">
        {tab.title || t("app.tabs.untitled")}
      </span>
      <button
        onClick={handleClose}
        className="ml-1 p-0.5 rounded hover:bg-[var(--accent)] transition-colors cursor-pointer"
        aria-label={t("app.tabs.close")}
      >
        <X className="h-3 w-3" />
      </button>
    </button>
  )
}
