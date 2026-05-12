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
        username: "",
        email: "",
        access_token: "",
        cryptoContext: undefined,
        updateSettings: (newSettings: UserSettings) => set({ settings: newSettings }),
        setUserInfo: (username: string, email: string) => set({ username, email }),
        updateAccessToken: (newAccessToken: string) => set({ access_token: newAccessToken }),

        updateCryptoContext: (newCryptoCtx: CryptoContext) => set({ cryptoContext: newCryptoCtx }),

        canSign: (): boolean => {
            const ctx: CryptoContext | undefined = useGlobalStore.getState().cryptoContext
            return !!ctx?.signingKeys.privateKey
        },

        clearKeys: () => set({ cryptoContext: undefined })
    }
})
