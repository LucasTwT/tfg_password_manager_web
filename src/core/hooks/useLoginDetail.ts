import { useState, useCallback } from "react"
import type { Login } from "@/core/types/login"
import { useClipboardClear } from "@/core/hooks/useClipboardClear"

interface UseLoginDetailReturn {
  isEditing: boolean
  editData: Partial<Login>
  showPassword: boolean
  copiedField: string | null
  startEdit: () => void
  cancelEdit: () => void
  saveEdit: () => Promise<void>
  updateField: (field: keyof Login, value: string) => void
  togglePassword: () => void
  copyField: (field: keyof Login, value: string) => void
}

export function useLoginDetail(
  login: Login,
  onSave?: (data: Partial<Login>) => Promise<void>
): UseLoginDetailReturn {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<Login>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const { copyWithClear } = useClipboardClear()

  const startEdit = useCallback(() => {
    setEditData({ ...login })
    setIsEditing(true)
    setShowPassword(false)
  }, [login])

  const cancelEdit = useCallback(() => {
    setEditData({})
    setIsEditing(false)
  }, [])

  const saveEdit = useCallback(async () => {
    if (onSave) {
      await onSave(editData)
    }
    setIsEditing(false)
  }, [editData, onSave])

  const updateField = useCallback((field: keyof Login, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  const copyField = useCallback(
    async (field: keyof Login, value: string) => {
      const ok = await copyWithClear(value)
      if (ok) {
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 2000)
      }
    },
    [copyWithClear]
  )

  return {
    isEditing,
    editData,
    showPassword,
    copiedField,
    startEdit,
    cancelEdit,
    saveEdit,
    updateField,
    togglePassword,
    copyField,
  }
}
