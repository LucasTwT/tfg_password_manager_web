import type { Logindata, LoginState, UpdatePayload } from "@/core/reducers/Create/useCreateLoginTypes"
import { useTranslation } from "react-i18next"
import { validateLoginForm } from "@/core/utils/helper/validateLoginForm"
import { encryptXChaCha } from "@/core/services/crypto"
import { useGlobalStore } from "@/core/store/useGlobalStore"
import { createLogin } from "@/core/services/api/endpoints/logins"
import { useAppStore } from "@/core/store/useAppStore"
import { CIPHER, VERSION } from "@/core/services/crypto/constants/cipher"
import { useState } from "react"

export function useCreateLogin({
    state,
    setError,
}: {
    state: LoginState
    setError: (payload: { field: keyof Logindata; value: string }) => void
}) {
    const { cryptoContext, canSign } = useGlobalStore()
    const { actualVault } = useAppStore()
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)

    async function createLoginEntry() {
        const { isValid, errors } = validateLoginForm(state.logindata, t)

        if (!isValid) {
            (Object.entries(errors) as [keyof Logindata, string][]).forEach(
                ([field, value]) => setError({ field, value }),
            )
            return
        }

        if (canSign() && cryptoContext && actualVault) {
            setLoading(true)
            try {
                const { ciphertext, nonce } = await encryptXChaCha(
                    JSON.stringify(state.logindata),
                    cryptoContext.vaultKey,
                )
                await createLogin({
                    vaultId: actualVault.id,
                    ciphertext,
                    nonce,
                    cipher: CIPHER,
                    version: VERSION,
                })
            } finally {
                setLoading(false)
            }
        }
    }

    return { createLogin: createLoginEntry, loading }
}
