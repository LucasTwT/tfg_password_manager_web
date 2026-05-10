import { API_URL } from "../constants"
import { apiFetch } from "../httpClient"

export async function getSettings() {
    try {
        const response = await apiFetch(`${API_URL}/settings/get`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
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
