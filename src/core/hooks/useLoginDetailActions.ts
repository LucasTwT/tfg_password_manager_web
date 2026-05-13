import { useCallback } from "react"
import { useAppDispatch } from "@/app/context/AppContext"
import { generatePassword } from "@/core/services/crypto"
import type { Login } from "@/core/types/login"
import type { PasswordGeneratorOptions } from "@/core/reducers/Create/useGenerateKeyTypes"
import { PasswordType } from "@/core/reducers/Create/useGenerateKeyTypes"

const defaultGeneratorOptions: PasswordGeneratorOptions = {
  type: PasswordType.random,
  length: 20,
  includeUppercase: true,
  includeNumbers: true,
  includeSymbols: true,
  avoidAmbiguous: true,
  allowRepeating: true,
  wordsCount: 4,
  excludeWeakWords: false,
}

interface UseLoginDetailActionsOptions {
  login: Login
  cryptoReady: boolean
  requestUnlock: () => void
  modifyLogin: (vaultId: string, loginId: string, data: Partial<Login>) => Promise<{ success: boolean; error?: string; details?: any }>
  updateField?: (field: keyof Login, value: string) => void
  isEditing?: boolean
  editDataUrl?: string
}

export function useLoginDetailActions({
  login,
  cryptoReady,
  requestUnlock,
  modifyLogin,
  updateField,
  isEditing = false,
  editDataUrl,
}: UseLoginDetailActionsOptions) {
  const dispatch = useAppDispatch()

  const handleSave = useCallback(
    async (data: Partial<Login>) => {
      if (!cryptoReady) {
        console.warn("[handleSave] Crypto context not ready - requesting unlock")
        requestUnlock()
        return
      }
      const result = await modifyLogin(login.vaultId, login.id, { ...login, ...data })
      if (result.success) {
        console.log("[handleSave] Login modified successfully")
        const updatedLogin = { ...login, ...data }
        dispatch({
          type: "OPEN_TAB",
          tab: { id: login.id, type: "login", title: data.title || login.title, data: updatedLogin },
        })
        console.log(`[handleSave] Dispatching login-modified event for vault ${login.vaultId}`)
        window.dispatchEvent(new CustomEvent("login-modified", {
          detail: {
            vaultId: login.vaultId,
            loginId: login.id,
            updates: {
              title: data.title ?? login.title,
              username: data.username ?? login.username,
              email: data.email ?? login.email,
              password: data.password ?? login.password,
              url: data.url ?? login.url,
              notes: data.notes ?? login.notes,
            }
          }
        }))
      } else {
        console.error("[handleSave] Failed to modify login", result.error, result.details)
      }
    },
    [login, modifyLogin, dispatch, cryptoReady, requestUnlock]
  )

  const handleGeneratePassword = useCallback(() => {
    updateField?.("password", generatePassword(defaultGeneratorOptions))
  }, [updateField])

  const handleOpenUrl = useCallback(() => {
    const url = isEditing ? editDataUrl ?? login.url : login.url
    if (url) {
      const finalUrl = url.startsWith("http") ? url : `https://${url}`
      window.open(finalUrl, "_blank", "noopener,noreferrer")
    }
  }, [isEditing, editDataUrl, login.url])

  return {
    handleSave,
    handleGeneratePassword,
    handleOpenUrl,
  }
}
