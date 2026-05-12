import { useTranslation } from "react-i18next"
import { Copy, Check } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"

interface FieldRowProps {
  icon: React.ReactNode
  label: string
  value: string
  field: string
  isEditing: boolean
  copiedField: string | null
  onCopy: () => void
  onChange: (value: string) => void
}

export function FieldRow({
  icon,
  label,
  value,
  field,
  isEditing,
  copiedField,
  onCopy,
  onChange,
}: FieldRowProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-[var(--muted-foreground)]">
        {icon}
        {label}
      </Label>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1"
          />
        ) : (
          <span className="flex-1 text-sm text-[var(--foreground)] truncate">
            {value || "\u2014"}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onCopy}
          aria-label={t("app.content.loginDetail.copy")}
        >
          {copiedField === field ? (
            <Check className="h-4 w-4 text-[var(--success)]" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
