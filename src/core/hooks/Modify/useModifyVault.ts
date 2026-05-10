import type { UpdatePayload } from "@/core/reducers/Create/useCreateVault.d"
import type { Vault } from "@/core/reducers/Home/useHome.d"
import { requestModifyVault } from "@/core/services/api/endpoints/vaults"
import { useAppStore } from "@/core/store/useAppStore"
import { validateModifyVaultName } from "@/core/utils/validations/Modify"
import { useEffect } from "react"

export function useModifyVault({
    modify,
    vault,
    updatedVault,
    initVault,
    t,
    setError,
    onSubmit,
}: {
    modify: boolean
    vault?: Vault
    updatedVault?: Vault
    initVault: (payload: { vault: Vault }) => void
    t: (key: string, opts?: Record<string, unknown>) => string
    setError: (error: UpdatePayload) => void
    onSubmit?: (fn: () => void) => void
}) {
    const { userVaults, modifyVault } = useAppStore()

    // Load of the vault to be modified
    useEffect(() => {
        if (!modify || !vault) return
        initVault({ vault })
    }, [initVault, modify, vault])

    // Verify vault data
    useEffect(() => {
        if (!modify || !updatedVault) return
        setError({ field: "name", value: validateModifyVaultName(updatedVault, t, userVaults) })
    }, [modify, updatedVault, userVaults, setError, t])

    // Modify vault function — caller triggers via onSubmit callback
    const submitModify = async () => {
        if (!modify || !updatedVault) return

        const error = validateModifyVaultName(updatedVault, t, userVaults)
        setError({ field: "name", value: error })
        if (error !== "") return

        const { response, status } = await requestModifyVault(updatedVault)
        if (status === 202) modifyVault(updatedVault)
    }

    // Register submit handler if provided
    useEffect(() => {
        if (onSubmit) {
            onSubmit(submitModify)
        }
    }, [updatedVault, userVaults, modify])

    return { submitModify }
}
