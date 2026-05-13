import { useTranslation } from "react-i18next"
import { Pencil, Save, X, Trash2 } from "lucide-react"
import { Button } from "@/app/components/ui/button"

interface LoginActionsProps {
  isEditing: boolean
  onStartEdit: () => void
  onCancelEdit: () => void
  onSave: () => void
  onDelete: () => void
}

export function LoginActions({
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSave,
  onDelete,
}: LoginActionsProps) {
  const { t } = useTranslation()

  if (isEditing) {
    return (
      <>
        <Button variant="outline" size="sm" onClick={onCancelEdit}>
          <X className="h-4 w-4 mr-1" />
          {t("logins.create.cancel")}
        </Button>
        <Button size="sm" onClick={onSave}>
          <Save className="h-4 w-4 mr-1" />
          {t("logins.edit.save")}
        </Button>
      </>
    )
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={onStartEdit}>
        <Pencil className="h-4 w-4 mr-1" />
        {t("app.content.loginDetail.edit")}
      </Button>
      <Button variant="destructive" size="sm" onClick={onDelete}>
        <Trash2 className="h-4 w-4 mr-1" />
        {t("app.content.loginDetail.delete")}
      </Button>
    </>
  )
}
