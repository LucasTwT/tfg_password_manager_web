import { API_URL } from "../constants"
import { apiFetch } from "../httpClient"
import type { UserSettings } from "@/core/store/globalStoreTypes"

export async function getSettings() {
    try {
        const response = await apiFetch(`${API_URL}/settings/get`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
        if (!response.ok) {
            const errorData = await response.json()
            return { response: errorData, status: false }
        }
        return { response: await response.json(), status: true }
    } catch (error) {
        return { response: error, status: false }
    }
}

export async function updateSettings(settings: UserSettings) {
    try {
        const response = await apiFetch(`${API_URL}/settings/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ settings }),
        })
        if (!response.ok) {
            const errorData = await response.json()
            return { response: errorData, status: false }
        }
        return { response: await response.json(), status: true }
    } catch (error) {
        return { response: error, status: false }
    }
}
