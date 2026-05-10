import { useEffect } from "react"
import type { LoginState } from "@/core/reducers/Auth/useLogin.d"
import type { RequestError } from "@/core/reducers/Auth/useRegister.d"
import { regenerateKeys, signChallenge } from "@/core/services/crypto"
import { authLoginStart, finishLogin } from "@/core/services/api/endpoints/auth"
import { useGlobalStore } from "@/core/store/useGlobalStore"
import { storage } from "@/core/storage"

export const useLoginUser = (
    state: LoginState,
    pressed: boolean,
    setPressed: React.Dispatch<React.SetStateAction<boolean>>,
    setRequestError: (payload: RequestError) => void
) => {
    const { updateAccessToken, updateRefreshToken } = useGlobalStore()

    useEffect(() => {
        const { identifier, password } = state.userdata
        if (
            (state.errors.identifier === "" && state.errors.password === "") &&
            (password !== "" && identifier !== "")
        ) {
            authLoginStart(identifier).then(async ({ response, status }) => {
                if (status) {
                    await regenerateKeys(password, response["salt"], response["kdf_params"])
                    const signature = await signChallenge(response["challenge"])
                    if (signature) {
                        const result = await finishLogin(identifier, signature)
                        if (result.status) {
                            updateAccessToken(result.response["access_token"])
                            updateRefreshToken(result.response["refresh_token"])
                            await storage.set("sensitive_data", {
                                salt: response["salt"],
                                refresh_token: result.response["refresh_token"],
                            })
                            window.location.href = "/home"
                        } else {
                            setRequestError({ title: "Error", msg: result.response.detail })
                        }
                    }
                } else {
                    setRequestError({ title: "Error", msg: "Wrong email or username" })
                }
            })
        }
    }, [pressed, setPressed])
}
