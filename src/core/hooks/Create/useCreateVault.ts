import type { Vault } from "@/core/reducers/Home/useHome.d"
import { requestCreateVault } from "@/core/services/api/endpoints/vaults"
import { getVaults } from "@/core/services/api/endpoints/vaults"
import { useAppStore } from "@/core/store/useAppStore"
import { validateVaultName } from "@/core/utils/validations/Create"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

export function useCreateVault({
    vault,
    setError,
    modify,
    onSubmit,
}: {
    vault: Vault
    setError: (error: string) => void
    modify: boolean
    onSubmit?: (fn: () => void) => void
}) {
    const { userVaults, initUserVaults } = useAppStore()
    const { t } = useTranslation()

    // Validate vault name on input change
    useEffect(() => {
        if (modify) return
        const error = validateVaultName(vault.name, t, userVaults)
        setError(error)
    }, [vault.name, userVaults, modify])

    // Create vault function — caller triggers via onSubmit callback
    const createVault = async () => {
        if (modify) return

        const error = validateVaultName(vault.name, t, userVaults)
        setError(error)
        if (error !== "") return

        const { response, status } = await requestCreateVault(vault)
        if (status === 201) {
            const vaultsResult = await getVaults()
            if (vaultsResult.status === 200) {
                initUserVaults(vaultsResult.response.vaults)
            }
        }
    }

    // Register submit handler if provided
    useEffect(() => {
        if (onSubmit) {
            onSubmit(createVault)
        }
    }, [vault, userVaults, modify])

    return { createVault }
}
