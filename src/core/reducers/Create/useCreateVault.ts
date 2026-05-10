import { useReducer } from "react"
import type {CreateVaultAction, CreateVaultState, UpdatePayload} from "./useCreateVaultTypes"
import { DEFAULT_COLORS, FOUNDATION_ICONS } from "@/core/utils/constants"
import type { Vault } from "../Home/useHomeTypes"

const initialState: CreateVaultState = {
    vaultPreview: {
        id: "",
        name: "",
        settings: {
            icon: "lock",
            colors: DEFAULT_COLORS[0]
        },
        created_at: "",
        updated_at: ""
    },
    error: {name: ""},
    icons: FOUNDATION_ICONS,
    sendButton: false
}

function reducer(state: CreateVaultState, action: CreateVaultAction): CreateVaultState {
    const { type, payload } = action
    switch(type) {
        case "INIT_VAULT": {
            return {
                ...state,
                vaultPreview: payload.vault
            }
        }
        case "CHANGE_VAULT_FIELDS": {
            return {
                ...state,
                vaultPreview: {...state.vaultPreview, [payload.field]: payload.value}
            }
        }
        case "SET_VAULT_ERROR": {
            return {
                ...state,
                error: {...state.error, [payload.field]: payload.value}
            }
        }
        case "SEND_BUTTON": {
            return {
                ...state,
                sendButton: payload.val
            }
        }
        default:
            return state
    }
}


export function useCreateVaultReducer () {
    const [state, dispatch ] = useReducer(reducer, initialState)
    const initVault = (payload: {vault: Vault}) => dispatch({type: "INIT_VAULT", payload: payload})
    const changeVaultFields = (payload: UpdatePayload) => dispatch({type: "CHANGE_VAULT_FIELDS", payload: payload})
    const setVaultError = (payload: UpdatePayload) => dispatch({type: "SET_VAULT_ERROR", payload: payload})
    const sendButton = (payload: {val: boolean}) => dispatch({type: "SEND_BUTTON", payload: payload})
    return { state, initVault, changeVaultFields, setVaultError, sendButton }
}
