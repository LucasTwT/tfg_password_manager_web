import { useTranslation } from "react-i18next"
import { ShieldOff } from "lucide-react"

export function EmptyState() {
  const { t } = useTranslation()

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
      <div className="w-16 h-16 rounded-full bg-[var(--secondary)] flex items-center justify-center">
        <ShieldOff className="h-8 w-8 text-[var(--muted-foreground)]" />
      </div>
      <h3 className="text-lg font-medium text-[var(--foreground)]">
        {t("app.content.emptyState.title")}
      </h3>
      <p className="text-sm text-[var(--muted-foreground)] max-w-sm">
        {t("app.content.emptyState.description")}
      </p>
    </div>
  )
}
