import { challengeFinish } from "@/core/services/api/endpoints/auth"
import { challengeStart } from "@/core/services/api/endpoints/auth"
import { regenerateKeys, signChallenge } from "@/core/services/crypto"
import { validatePassword } from "@/core/utils/validations/Login"
import { useState, useCallback } from "react"
import { useTranslation } from "react-i18next"

export function useMasterPassword() {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const challengeLogin = useCallback(async (password: string): Promise<boolean> => {
        if (!password) return false

        const validationError = validatePassword(password, t)
        if (validationError) {
            setError(validationError)
            return false
        }

        setError("")
        setLoading(true)

        try {
            const { status, response } = await challengeStart()
            if (!status || !response) {
                setError("Error de conexión")
                return false
            }

            const { salt, kdf_params, challenge } = response
            if (!salt || !kdf_params || !challenge) {
                setError("Invalid challenge payload")
                return false
            }

            await regenerateKeys(password, salt, kdf_params)
            const signature = await signChallenge(challenge)
            if (!signature) {
                setError("Error de firma")
                return false
            }

            const res = await challengeFinish({ signedChallenge: signature })
            if (res?.status && res.response?.status) {
                return true
            } else {
                setError("Contraseña incorrecta")
                return false
            }
        } catch {
            setError("Error inesperado")
            return false
        } finally {
            setLoading(false)
        }
    }, [t])

    return { challengeLogin, loading, error, setError }
}
