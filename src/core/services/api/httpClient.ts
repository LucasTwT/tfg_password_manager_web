import { useGlobalStore } from "@/core/store/useGlobalStore"
import { API_URL } from "./constants"

async function refresh(): Promise<{ response: string; status: boolean }> {
    const { refresh_token, updateAccessToken } = useGlobalStore.getState()
    try {
        const content = JSON.stringify({ refresh_token: refresh_token })
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: content,
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

async function verifyJwt(access_token: string): Promise<{ status: boolean }> {
    try {
        if (!access_token) return { status: false }
        const response = await fetch(`${API_URL}/auth/verify_token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
        })

        if (!response.ok) {
            return { status: false }
        }
        return { status: true }
    } catch {
        return { status: false }
    }
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const { access_token } = useGlobalStore.getState()
    let token = access_token

    const { status: jwtValid } = await verifyJwt(token)

    if (!jwtValid) {
        const { response: newJwt, status: newToken } = await refresh()
        if (!newToken) throw new Error("No se pudo refrescar el token")
        token = newJwt
    }

    const res = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
        },
    })

    if (res.status === 401) {
        const { response: newJwt, status: newToken } = await refresh()
        if (!newToken) return res
        return fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${newJwt}`,
            },
        })
    }
    return res
}
