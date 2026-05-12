import { useEffect } from "react"
import { generateSalt, regenerateKeys } from "@/core/services/crypto"
import { registerUser } from "@/core/services/api/endpoints/auth"
import type { RegisterState, RequestError } from "@/core/reducers/Auth/useRegisterTypes"
import { useGlobalStore } from "@/core/store/useGlobalStore"
import { useFetchSettings } from "@/core/hooks/useFetchSettings"
import { storage } from "@/core/storage"

export const useCreateUser = (
    state: RegisterState,
    pressed: boolean,
    setPressed: React.Dispatch<React.SetStateAction<boolean>>,
    setRequestError: (payload: RequestError) => void
) => {
    const updateAccessToken = useGlobalStore((s) => s.updateAccessToken)
    const { fetchAndApplySettings } = useFetchSettings()

    useEffect(() => {
        const { username, password, email } = state.userdata
        if (
            (state.errors.username === "" && state.errors.email === "" && state.errors.password === "") &&
            (username !== "" && password !== "" && email !== "")
        ) {
            generateSalt().then((salt) => {
                regenerateKeys(password, salt).then(() => {
                    registerUser(username, email, salt).then(async ({ response, status }) => {
                        if (status) {
                            updateAccessToken(response["access_token"])
                            await storage.set("sensitive_data", {
                                salt,
                            })
                            // Fetch settings + user info
                            await fetchAndApplySettings()
                            window.location.href = "/home"
                        } else {
                            setRequestError({ title: "Error", msg: response.detail })
                        }
                    })
                })
            })
        }
    }, [pressed, setPressed])
}
