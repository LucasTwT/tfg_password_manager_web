import { RequestError } from "../Auth/useRegisterTypes"

export interface LoginState {
    logindata: Logindata
    generateKey: boolean
    errors: ErrorLogindata
    requestError: RequestError 
}

export interface Logindata {
    title: string,
    email: string,
    url: string,
    note: string,
    password: string
} 

export interface ErrorLogindata {
    title: string,
    email: string,
    url: string,
    note: string,
    password: string
}

type Validator = (value: string, t: any, extraParam?: string) => string;

export type UpdatePayload = {  [K in keyof Logindata] : { field: K; value: Logindata[K]} }[keyof Logindata]

export type RegisterAction = 
    | {type: "SET_LOGINDATA", payload: UpdatePayload}
    | {type: "SET_ERRORS", payload: UpdatePayload}
    | {type: "SET_KEY_GENERATOR", payload: {newValue: boolean}}
    | {type: "SET_REQUEST_ERROR", payload: RequestError}
