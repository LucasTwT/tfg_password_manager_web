import { useGlobalStore } from "@/core/store/useGlobalStore"
import { API_URL } from "./constants"
import { platformFetch } from "./adapters/platformFetch"

async function refresh(): Promise<{ response: string; status: boolean }> {
    const { updateAccessToken } = useGlobalStore.getState()
    try {
        // Refresh token is sent automatically via HttpOnly cookie (browser)
        // or via Tauri HTTP plugin cookie jar (desktop)
        const response = await platformFetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            const error = await response.json()
            return { response: error, status: false }
        }
        const { access_token } = await response.json()
        updateAccessToken(access_token)
        return { response: access_token, status: true }
    } catch (error) {
        return { response: String(error), status: false }
    }
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const { access_token } = useGlobalStore.getState()
    let token = access_token

    const res = await platformFetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    })

    if (res.status === 401) {
        const { response: newJwt, status: newToken } = await refresh()
        if (!newToken) return res
        return platformFetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${newJwt}`,
            },
        })
    }
    return res
}
