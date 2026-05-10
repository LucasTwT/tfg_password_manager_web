import { useReducer } from "react";
import type { RegisterAction, LoginState, UpdatePayload } from "./useCreateLoginTypes";
import type { RequestError } from "../Auth/useRegisterTypes";

export const initialState: LoginState = {
    logindata: {title: "", email: "", url: "", note: "", password: ""},
    generateKey: false,
    errors: {title: "", email: "", url: "", note: "", password: ""},
    requestError: {title: "", msg: ""}
} 

function reducer (state: LoginState, action: RegisterAction): LoginState {
    const { type, payload } = action
    switch (type) {
        case "SET_LOGINDATA": {
            return {
                ...state,
                logindata: {...state.logindata, [payload.field]: payload.value}
            }
        }
        case "SET_ERRORS": {
            return {
                ...state,
                errors: {...state.errors, [payload.field]: payload.value}
            }
        }

        case "SET_KEY_GENERATOR": {
            return {
                ...state,
                generateKey: payload.newValue
            }
        }

        case "SET_REQUEST_ERROR": {
            return {
                ...state,
                requestError: payload
            }
        }
        default: {
            return state
        }
    }
} 

export function useCreateLoginReducer () {
    const [state, dispatch] = useReducer(reducer, initialState)
    const setLogindata = (payload: UpdatePayload) => dispatch({type: "SET_LOGINDATA", payload: payload}) 
    const setKeyGenerator = (payload: {newValue: boolean}) => dispatch({type: "SET_KEY_GENERATOR", payload: payload})
    const setErrors = (payload: UpdatePayload) => dispatch({type: "SET_ERRORS", payload: payload})
    const setRequestError = (payload: RequestError) => dispatch({type: "SET_REQUEST_ERROR", payload: payload})
    return { state, setLogindata, setErrors, setRequestError, setKeyGenerator }
}
