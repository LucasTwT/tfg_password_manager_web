import { useEffect, useState } from "react"
import { useGlobalStore } from "@/core/store/useGlobalStore"
import { useFetchSettings } from "@/core/hooks/useFetchSettings"
import { API_URL } from "@/core/services/api/constants"

export function useAppInit() {
    const [ready, setReady] = useState(false)
    const updateAccessToken = useGlobalStore((s) => s.updateAccessToken)
    const { fetchAndApplySettings } = useFetchSettings()

    useEffect(() => {
        let cancelled = false

        async function init() {
            // If we already have an access_token, just fetch settings
            const { access_token } = useGlobalStore.getState()
            if (access_token) {
                await fetchAndApplySettings()
                if (!cancelled) setReady(true)
                return
            }

            // Otherwise try to refresh from cookie
            try {
                const response = await fetch(`${API_URL}/auth/refresh`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                })

                if (!cancelled && response.ok) {
                    const { access_token: newToken } = await response.json()
                    updateAccessToken(newToken)
                    await fetchAndApplySettings()
                }
            } catch {
                // No valid cookie
            }

            if (!cancelled) {
                setReady(true)
            }
        }

        init()

        return () => {
            cancelled = true
        }
    }, [])

    return { ready }
}
