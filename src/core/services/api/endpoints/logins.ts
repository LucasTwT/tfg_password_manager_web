import { API_URL } from "../constants"
import { apiFetch } from "../httpClient"

export async function loginStart(params: {
    vaultId: string
    ciphertext: string
    nonce: string
    cipher: string
    version: number
}) {
    try {
        const content = JSON.stringify({
            ciphertext: params.ciphertext,
            nonce: params.nonce,
            cipher: params.cipher,
            version: params.version,
        })
        const response = await apiFetch(
            `${API_URL}/login/${params.vaultId}/create`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: content,
            }
        )
        if (!response.ok) {
            const errorData = await response.json()
            return { response: errorData, status: false }
        }
        return { response: await response.json(), status: true }
    } catch (error) {
        return { response: error, status: false }
    }
}
