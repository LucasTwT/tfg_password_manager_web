import { useEffect, useState } from "react"
import { useGlobalStore } from "@/core/store/useGlobalStore"
import { useFetchSettings } from "@/core/hooks/useFetchSettings"
import { API_URL } from "@/core/services/api/constants"
import { platformFetch } from "@/core/services/api/adapters/platformFetch"

export function useAutoLogin() {
    const [checking, setChecking] = useState(true)
    const updateAccessToken = useGlobalStore((s) => s.updateAccessToken)
    const { fetchAndApplySettings } = useFetchSettings()

    useEffect(() => {
        let cancelled = false

        async function tryRefresh() {
            try {
                const response = await platformFetch(`${API_URL}/auth/refresh`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                })

                if (!cancelled && response.ok) {
                    const { access_token } = await response.json()
                    updateAccessToken(access_token)

                    // Fetch user settings + info
                    await fetchAndApplySettings()

                    window.location.href = "/home"
                    return
                }
            } catch {
                // No valid cookie — user needs to log in
            }

            if (!cancelled) {
                setChecking(false)
            }
        }

        tryRefresh()

        return () => {
            cancelled = true
        }
    }, [])

    return { checking }
}
