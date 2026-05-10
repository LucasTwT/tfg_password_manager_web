import { Vault } from "../Home/useHome.d";

export interface CreateVaultState {
    vaultPreview: Vault,
    icons: string[], 
    error: VaultError,
    sendButton: boolean
}

export interface VaultError {
    name: string
}

export type UpdatePayload = {  [K in keyof Vault] : { field: K; value: Vault[K]} }[keyof Vault]

export type CreateVaultAction = 
    | {type: "INIT_VAULT", payload: {vault: Vault}}
    | {type: "CHANGE_VAULT_FIELDS", payload: UpdatePayload}
    | {type: "SET_VAULT_ERROR", payload: UpdatePayload}
    | {type: "SEND_BUTTON", payload: {val: boolean}}
    
