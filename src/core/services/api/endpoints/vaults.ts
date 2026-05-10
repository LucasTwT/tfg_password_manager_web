import type { Vault } from "@/core/reducers/Home/useHomeTypes"
import { useAppStore } from "@/core/store/useAppStore"
import { API_URL } from "../constants"
import { apiFetch } from "../httpClient"

export async function requestCreateVault(vault: Vault) {
    try {
        const content = JSON.stringify({
            vault_name: vault.name,
            vault_config: vault.settings,
        })
        const response = await apiFetch(`${API_URL}/vault/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: content,
        })
        if (!response.ok) {
            const errorData = await response.json()
            return { response: errorData, status: response.status }
        }
        return { response: await response.json(), status: response.status }
    } catch (error) {
        return { response: error, status: false }
    }
}

export async function getVaults() {
    try {
        const response = await apiFetch(`${API_URL}/vault/all`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
        if (!response.ok) {
            const errorData = await response.json()
            return { response: errorData, status: response.status }
        }
        return { response: await response.json(), status: response.status }
    } catch (error) {
        return { response: error, status: false }
    }
}

export async function requestModifyVault(vault: Vault) {
    try {
        const content = JSON.stringify({ new_data: vault })
        const response = await apiFetch(`${API_URL}/vault/${vault.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: content,
        })
        if (!response.ok) {
            const errorData = await response.json()
            return { response: errorData, status: response.status }
        }
        return { response: await response.json(), status: response.status }
    } catch (error) {
        return { response: error, status: false }
    }
}

export async function startDeleteVault() {
    try {
        const response = await apiFetch(`${API_URL}/vault/start`, {
            method: "DELETE",
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

export async function finishDeleteVault(signature: string, vaultId: string) {
    const { initUserVaults } = useAppStore.getState()
    try {
        const content = JSON.stringify({ signature: signature })
        const response = await apiFetch(
            `${API_URL}/vault/${vaultId}/finish`,
            {
                method: "DELETE",
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
        getVaults().then(({ status, response }) => {
            if (status === 200) {
                initUserVaults(response.vaults)
            }
        })
        return { response: await response.json(), status: true }
    } catch (error) {
        return { response: error, status: false }
    }
}
