import type { KeyPair } from "libsodium-wrappers"

export interface GlobalState {
    // User settings
    settings: UserSettings
    updateSettings: (newSettings: UserSettings) => void
    // User info
    username: string
    email: string
    setUserInfo: (username: string, email: string) => void
    // Tokens (refresh_token lives in HttpOnly cookie)
    access_token: string
    updateAccessToken: (newAccessToken: string) => void
    // crypto
    cryptoContext?: CryptoContext
    updateCryptoContext: (newCryptoCtx: CryptoContext) => void
    canSign: () => boolean
    clearKeys: () => void
}

export interface CryptoContext {
    vaultKey: Uint8Array<ArrayBufferLike>
    authKey: Uint8Array<ArrayBufferLike>
    signingKeys: KeyPair
}

export interface UserSettings {
    lang: "es" | "en"
    theme: "dark" | "light" | "system"
    logged: boolean
    clipboard_cleaning: Clipboard_cleaning
}

export enum Clipboard_cleaning {
    later_15s = 15,
    later_1m = 60,
    later_2m = 120
}
