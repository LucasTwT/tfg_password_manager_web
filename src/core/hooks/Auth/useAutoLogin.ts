import { useEffect, useState } from "react"
import { useGlobalStore } from "@/core/store/useGlobalStore"
import { API_URL } from "@/core/services/api/constants"

export function useAutoLogin() {
    const [checking, setChecking] = useState(true)
    const updateAccessToken = useGlobalStore((s) => s.updateAccessToken)

    useEffect(() => {
        let cancelled = false

        async function tryRefresh() {
            try {
                const response = await fetch(`${API_URL}/auth/refresh`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                })

                if (!cancelled && response.ok) {
                    const { access_token } = await response.json()
                    updateAccessToken(access_token)
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
