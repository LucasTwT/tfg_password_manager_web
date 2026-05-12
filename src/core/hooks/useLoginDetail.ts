import { useState, useCallback } from "react"
import type { Login } from "@/core/types/login"
import { copyToClipboard } from "@/core/clipboard"

interface UseLoginDetailReturn {
  isEditing: boolean
  editData: Partial<Login>
  showPassword: boolean
  copiedField: string | null
  startEdit: () => void
  cancelEdit: () => void
  saveEdit: () => void
  updateField: (field: keyof Login, value: string) => void
  togglePassword: () => void
  copyField: (field: keyof Login, value: string) => void
}

export function useLoginDetail(
  login: Login,
  onSave?: (data: Partial<Login>) => void
): UseLoginDetailReturn {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<Login>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const startEdit = useCallback(() => {
    setEditData({ ...login })
    setIsEditing(true)
    setShowPassword(false)
  }, [login])

  const cancelEdit = useCallback(() => {
    setEditData({})
    setIsEditing(false)
  }, [])

  const saveEdit = useCallback(() => {
    onSave?.(editData)
    setIsEditing(false)
  }, [editData, onSave])

  const updateField = useCallback((field: keyof Login, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  const copyField = useCallback(async (field: keyof Login, value: string) => {
    const ok = await copyToClipboard(value)
    if (ok) {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    }
  }, [])

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
