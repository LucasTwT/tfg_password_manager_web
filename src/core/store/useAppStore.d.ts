import type { Vault } from "@/core/types/vault"

export interface AppGlobalState {
    userVaults: Vault[]
    actualVault?: Vault
    initUserVaults: (userVaults: Vault[]) => void
    addVault: (newVault: Vault) => void
    modifyVault: (modifiedVault: Vault) => void
    setActualVault: (vault: Vault) => void
}
