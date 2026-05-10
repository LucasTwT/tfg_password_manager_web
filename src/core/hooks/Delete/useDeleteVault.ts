import { finishDeleteVault } from "@/core/services/api/endpoints/vaults"
import { regenerateKeys, signChallenge } from "@/core/services/crypto"
import type { KdfParams } from "@/core/services/crypto/types"
import { usePopoverStore } from "@/core/store/usePopoverStore"
import { validatePassword } from "@/core/utils/validations/Login"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

export function useDeleteVault({
    password,
    salt,
    kdfParams,
    challenge,
    vaultId,
    onSuccess,
}: {
    salt: string
    kdfParams: KdfParams
    challenge: string
    password: string
    vaultId: string
    onSuccess?: () => void
}) {
    const { t } = useTranslation()
    const { changeVisible, setAnchorRef, setSelectedVault } = usePopoverStore()

    const deleteVault = async () => {
        if (validatePassword(password, t) !== "") return

        await regenerateKeys(password, salt, kdfParams)
        const signature = await signChallenge(challenge)
        if (signature) {
            const { status } = await finishDeleteVault(signature, vaultId)
            if (!status) return
            changeVisible(false)
            setAnchorRef(null)
            setSelectedVault(null)
            onSuccess?.()
        }
    }

    return { deleteVault }
}
