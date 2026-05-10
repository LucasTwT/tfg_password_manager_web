export interface RegisterState {
    userdata: Userdata,
    errors: ErrorUserdata,
    requestError: RequestError 
}

export interface RequestError {
    title: string,
    msg: string
}

export interface Userdata {
    username: string,
    email: string,
    password: string
} 

export interface ErrorUserdata {
    username: string,
    email: string,
    password: string
}

export type UpdatePayload = {  [K in keyof Userdata] : { field: K; value: Userdata[K]} }[keyof Userdata]

export type RegisterAction = 
    | {type: "SET_USERDATA", payload: UpdatePayload}
    | {type: "SET_ERRORS", payload: UpdatePayload}
    | {type: "SET_REQUEST_ERROR", payload: RequestError}
