import { useReducer } from "react";
import type { RegisterAction, RegisterState, RequestError, UpdatePayload } from "./useRegisterTypes";

export const initialState: RegisterState = {
    userdata: {username: "", email: "", password: ""},
    errors: {username: "", email: "", password: ""},
    requestError: {title: "", msg: ""}
} 

function reducer (state: RegisterState, action: RegisterAction): RegisterState {
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

export function useRegisterReducer () {
    const [state, dispatch] = useReducer(reducer, initialState)
    const setUserdata = (payload: UpdatePayload) => dispatch({type: "SET_USERDATA", payload: payload}) 
    const setErrors = (payload: UpdatePayload) => dispatch({type: "SET_ERRORS", payload: payload})
    const setRequestError = (payload: RequestError) => dispatch({type: "SET_REQUEST_ERROR", payload: payload})
    return { state, setUserdata, setErrors, setRequestError }
}
