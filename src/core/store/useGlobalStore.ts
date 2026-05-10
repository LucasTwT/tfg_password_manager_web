import { create } from "zustand"
import { Clipboard_cleaning } from "./globalStoreTypes"
import type { CryptoContext, GlobalState, UserSettings } from "./globalStoreTypes"

export const useGlobalStore = create<GlobalState>((set) => {
    return {
        settings: {
            theme: "system",
            lang: navigator.language.split("-")[0] as "es" | "en",
            logged: false,
            clipboard_cleaning: Clipboard_cleaning.later_2m
        },
        access_token: "",
        refresh_token: "",
        cryptoContext: undefined,
        updateSettings: (newSettings: UserSettings) => set({ settings: newSettings }),
        updateAccessToken: (newAccessToken: string) => set({ access_token: newAccessToken }),
        updateRefreshToken: (newRefreshToken: string) => set({ refresh_token: newRefreshToken }),

        updateCryptoContext: (newCryptoCtx: CryptoContext) => set({ cryptoContext: newCryptoCtx }),

        canSign: (): boolean => {
            const ctx: CryptoContext | undefined = useGlobalStore.getState().cryptoContext
            return !!ctx?.signingKeys.privateKey
        },

        clearKeys: () => set({ cryptoContext: undefined })
    }
})
