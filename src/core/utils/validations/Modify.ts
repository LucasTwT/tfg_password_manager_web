import type { Vault } from "@/core/reducers/Home/useHomeTypes"

export function validateModifyVaultName(vault: Vault, t: (key: string, opts?: Record<string, unknown>) => string, vaults: Vault[]) {
    if (vault.name.trim().length === 0) return t("create.vault.validations.vaultNameRequired")
    const vaultsEq = vaults.filter((v) => v.name === vault.name)
    if (vaultsEq.length === 1 && vaultsEq[0].id !== vault.id) 
        return t("create.vault.validations.vaultNameAlreadyExist")
    return ""
}
