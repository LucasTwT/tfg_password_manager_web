import { useReducer } from "react";
import type { RegisterAction, LoginState, UpdatePayload } from "./useLoginTypes";
import type { RequestError } from "./useRegisterTypes";

export const initialState: LoginState = {
    userdata: {identifier: "", password: ""},
    errors: {identifier: "", password: ""},
    requestError: {title: "", msg: ""}
} 

function reducer (state: LoginState, action: RegisterAction): LoginState {
    const { type, payload } = action
    switch (type) {
        case "SET_USERDATA": {
            return {
                ...state,
                userdata: {...state.userdata, [payload.field]: payload.value}
            }
        }
        case "SET_ERRORS": {
            return {
                ...state,
                errors: {...state.errors, [payload.field]: payload.value}
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

export function useLoginReducer () {
    const [state, dispatch] = useReducer(reducer, initialState)
    const setUserdata = (payload: UpdatePayload) => dispatch({type: "SET_USERDATA", payload: payload}) 
    const setErrors = (payload: UpdatePayload) => dispatch({type: "SET_ERRORS", payload: payload})
    const setRequestError = (payload: RequestError) => dispatch({type: "SET_REQUEST_ERROR", payload: payload})
    return { state, setUserdata, setErrors, setRequestError }
}
