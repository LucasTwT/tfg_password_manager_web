import { Settings, User } from "lucide-react"
import { useAppDispatch } from "@/app/context/AppContext"
import { useGlobalStore } from "@/core/store/useGlobalStore"
import { Button } from "@/app/components/ui/button"
import { useTranslation } from "react-i18next"

export function SidebarFooter() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const username = useGlobalStore((s) => s.username)

  return (
    <div className="p-3 border-t border-[var(--border)] flex items-center gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-7 h-7 rounded-full bg-[var(--secondary)] flex items-center justify-center shrink-0">
          <User className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
        </div>
        <span className="text-sm text-[var(--muted-foreground)] truncate">
          {username || "User"}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={() => dispatch({ type: "TOGGLE_SETTINGS" })}
        aria-label={t("app.settings.title")}
      >
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  )
}
