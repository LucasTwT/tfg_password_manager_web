import { useReducer } from "react";
import { Action, GenerateKeyState, PasswordGeneratorOptions, PasswordType, UpdatePayload } from "./useGenerateKey.d";
import { generatePassword } from "@/core/services/crypto/functions/generatePassword";

const initialState: GenerateKeyState = {
    keyOptions: {
        type: PasswordType.random,
        length: 15,
        includeUppercase: false,
        includeNumbers: false,
        includeSymbols: false,

        avoidAmbiguous: true,
        allowRepeating: false,

        wordsCount: 7,
        excludeWeakWords: false,
    },
    regenerateBtn: false,
    password: ""
}


function reducer(state: GenerateKeyState, action: Action): GenerateKeyState {
    const { type, payload } = action
    
    switch(type) {
        case "SET_KEY_OPTIONS": {
            if(!payload) return {...state}
            return {
                ...state,
                keyOptions: {...state.keyOptions, [payload.field]: payload.value}
            }
        }

        case "SET_PASSWORD": {
            return {
                ...state,
                password: payload.newPassword
            }
        }

        case "SET_REGENERATE_BTN": {
            return {
                ...state,
                regenerateBtn: payload.newVal
            }
        }

        case "REGENERATE_PASSWORD": {
            return {
                ...state,
                password: generatePassword(state.keyOptions)
            }
        }

        default: {
            return {...state}
        }
    }
}

export function useGenerateKeyReducer() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const setKeyOptions = (payload: UpdatePayload) => dispatch({type: "SET_KEY_OPTIONS", payload: payload}) 
    const setPassword = (payload: {newPassword: string}) => dispatch({type: "SET_PASSWORD", payload: payload})
    const regeneratePassword = () => dispatch({type: "REGENERATE_PASSWORD", payload: {}})
    const setRegenerateBtn = (payload: {newVal: boolean}) => dispatch({type: "SET_REGENERATE_BTN", payload: payload})
    return { state, setKeyOptions, setPassword, regeneratePassword, setRegenerateBtn }
}
