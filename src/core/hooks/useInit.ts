import { useEffect, type Dispatch, type SetStateAction } from "react"
import { getSettings } from "@/core/services/api/endpoints/users"
import { useGlobalStore } from "@/core/store/useGlobalStore"
import { storage } from "@/core/storage"
import type { UserSettings } from "@/core/store/globalStoreTypes"

export function useInit({ setLoading }: { setLoading: Dispatch<SetStateAction<boolean>> }) {
    const { updateRefreshToken, updateSettings } = useGlobalStore.getState()

    useEffect(() => {
        init(updateRefreshToken, updateSettings, setLoading)
    }, [])
}

async function init(
    updateRefreshToken: (newRefreshToken: string) => void,
    updateSettings: (newSettings: UserSettings) => void,
    setLoading: Dispatch<SetStateAction<boolean>>,
) {
    try {
        const data = await storage.get<{ refresh_token: string; salt: string }>("sensitive_data")
        if (data) {
            const { refresh_token } = data
            updateRefreshToken(refresh_token)
            const settingsResponse = await getSettings()
            if (settingsResponse.status) {
                updateSettings(settingsResponse.response["settings"])
                window.location.href = "/home"
            } else {
                window.location.href = "/login"
            }
        } else {
            window.location.href = "/register"
        }
    } catch {
        // Silent fail — user stays on current page
    } finally {
        setLoading(false)
    }
}
