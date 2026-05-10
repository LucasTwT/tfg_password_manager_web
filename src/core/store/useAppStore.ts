import { create } from "zustand"
import type { AppGlobalState } from "./useAppStore.d"
import type { Vault } from "@/core/types/vault"

export const useAppStore = create<AppGlobalState>((set) => {
    return {
        userVaults: [],
        actualVault: undefined,
        initUserVaults: (vaults: Vault[]) => set({ userVaults: vaults, actualVault: vaults[0] }),
        addVault: (vault: Vault) => {
            set((prevState) => {
                const userVaults = [...prevState.userVaults]
                userVaults.push(vault)
                return { userVaults: userVaults }
            })
        },
        modifyVault: (modifiedVault: Vault) => {
            set((prevState) => {
                const userVaults = [...prevState.userVaults]
                const userVaultsModified = userVaults.map((vault) => {
                    if (modifiedVault.id === vault.id) {
                        return modifiedVault
                    } else {
                        return vault
                    }
                })
                return { userVaults: userVaultsModified }
            })
        },
        setActualVault: (vault: Vault) => {
            set({ actualVault: vault })
        }
    }
})
