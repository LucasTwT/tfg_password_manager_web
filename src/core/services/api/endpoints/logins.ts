import { API_URL } from "../constants"
import { apiFetch } from "../httpClient"

export async function getLogins(vaultId: string): Promise<{ response: any; status: boolean; error?: string }> {
  console.log("[apiGetLogins] Request started", { vaultId })

  try {
    const response = await apiFetch(`${API_URL}/login/${vaultId}/all`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })

    console.log("[apiGetLogins] HTTP response status", response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[apiGetLogins] FAIL: Non-ok response", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      })
      return {
        response: errorData,
        status: false,
        error: errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    const responseData = await response.json()
    console.log("[apiGetLogins] SUCCESS", { loginCount: responseData.user_logins?.length ?? 0 })
    return { response: responseData, status: true }
  } catch (error) {
    console.error("[apiGetLogins] FAIL: Exception thrown", error)
    return { response: error, status: false, error: error instanceof Error ? error.message : "Network error" }
  }
}

export async function createLogin(
  vaultId: string,
  title: string,
  encryptedData: { ciphertext: string; nonce: string }
): Promise<{ response: any; status: boolean; error?: string }> {
  console.log("[apiCreateLogin] Request started", {
    vaultId,
    title,
    ciphertextLength: encryptedData.ciphertext.length,
    nonceLength: encryptedData.nonce.length,
  })

  try {
    const requestBody = {
      title,
      ciphertext: encryptedData.ciphertext,
      nonce: encryptedData.nonce,
      cipher: "xchacha20poly1305",
      version: 1,
    }
    console.log("[apiCreateLogin] Sending request to /login/{vaultId}/create", requestBody)

    const response = await apiFetch(`${API_URL}/login/${vaultId}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })

    console.log("[apiCreateLogin] HTTP response status", response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[apiCreateLogin] FAIL: Non-ok response", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      })
      return {
        response: errorData,
        status: false,
        error: errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    const responseData = await response.json()
    console.log("[apiCreateLogin] SUCCESS", responseData)
    return { response: responseData, status: true }
  } catch (error) {
    console.error("[apiCreateLogin] FAIL: Exception thrown", error)
    return {
      response: error,
      status: false,
      error: error instanceof Error ? error.message : "Network error",
    }
  }
}

export async function modifyLogin(
  vaultId: string,
  loginId: string,
  title: string,
  encryptedData: { ciphertext: string; nonce: string }
): Promise<{ response: any; status: boolean; error?: string }> {
  console.log("[apiModifyLogin] Request started", {
    vaultId,
    loginId,
    title,
    ciphertextLength: encryptedData.ciphertext.length,
    nonceLength: encryptedData.nonce.length,
  })

  try {
    const requestBody = {
      new_data: {
        id: loginId,
        vault_id: vaultId,
        title,
        ciphertext: encryptedData.ciphertext,
        nonce: encryptedData.nonce,
        cipher: "xchacha20poly1305",
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    }
    console.log("[apiModifyLogin] Sending PATCH request to /login/{vaultId}/{loginId}", requestBody)

    const response = await apiFetch(
      `${API_URL}/login/${vaultId}/${loginId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    )

    console.log("[apiModifyLogin] HTTP response status", response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[apiModifyLogin] FAIL: Non-ok response", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      })
      return {
        response: errorData,
        status: false,
        error: errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    const responseData = await response.json()
    console.log("[apiModifyLogin] SUCCESS", responseData)
    return { response: responseData, status: true }
  } catch (error) {
    console.error("[apiModifyLogin] FAIL: Exception thrown", error)
    return {
      response: error,
      status: false,
      error: error instanceof Error ? error.message : "Network error",
    }
  }
}

export async function startDeleteLogin() {
  try {
    const response = await apiFetch(`${API_URL}/login/start`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
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

export async function finishDeleteLogin(
  vaultId: string,
  loginId: string,
  signature: string
) {
  try {
    const response = await apiFetch(
      `${API_URL}/login/${vaultId}/${loginId}/finish`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature }),
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
