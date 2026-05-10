import { useGlobalStore } from "@/core/store/useGlobalStore"
import { KDF_PARAMS } from "@/core/services/crypto/constants/argon2idParams"
import { API_URL } from "../constants"
import { apiFetch } from "../httpClient"
import sodium from "libsodium-wrappers"

// --- Public endpoints (no JWT required) ---

export async function authLoginStart(identifier: string) {
    try {
        const content = JSON.stringify({ identifier })
        const response = await fetch(`${API_URL}/auth/login/start`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: content,
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

export async function finishLogin(identifier: string, signature: string) {
    try {
        const content = JSON.stringify({
            identifier: identifier,
            signature: signature,
        })
        const response = await fetch(`${API_URL}/auth/login/finish`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: content,
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

export async function registerUser(
    username: string,
    email: string,
    authSalt: string
) {
    const { cryptoContext, settings } = useGlobalStore.getState()
    if (!cryptoContext)
        return {
            response: "Error de sincronización intente de nuevo",
            status: false,
        }
    try {
        await sodium.ready
        const content = JSON.stringify({
            username: username,
            email: email,
            public_key: sodium.to_base64(
                cryptoContext.signingKeys.publicKey,
                sodium.base64_variants.ORIGINAL
            ),
            auth_salt: authSalt,
            kdf_params: KDF_PARAMS,
            default_settings: settings,
        })

        const response = await fetch(`${API_URL}/auth/register/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: content,
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

export async function requestSalt(identifier: string) {
    try {
        const content = JSON.stringify({ identifier })
        const response = await fetch(`${API_URL}/auth/request_salt`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: content,
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

export async function logout() {
    try {
        const response = await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
        return { response: await response.json(), status: response.ok }
    } catch (error) {
        return { response: error, status: false }
    }
}

// --- Authenticated endpoints (JWT required via httpClient) ---

export async function challengeStart() {
    try {
        const response = await apiFetch(`${API_URL}/auth/challenge/start`, {
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

export async function challengeFinish({
    signedChallenge,
}: {
    signedChallenge: string
}) {
    const content = JSON.stringify({ signature: signedChallenge })
    try {
        const response = await apiFetch(`${API_URL}/auth/challenge/finish`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: content,
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
