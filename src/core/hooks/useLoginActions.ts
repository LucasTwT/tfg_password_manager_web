import { useCallback } from "react"
import type { Login } from "@/core/types/login"
import { encryptXChaCha, decryptXChaCha } from "@/core/services/crypto"
import {
  getLogins,
  createLogin as apiCreateLogin,
  modifyLogin as apiModifyLogin,
  startDeleteLogin,
  finishDeleteLogin,
} from "@/core/services/api/endpoints/logins"
import { signChallenge } from "@/core/services/crypto"
import { useGlobalStore } from "@/core/store/useGlobalStore"

interface EncryptedLoginPayload {
  id: string
  title: string
  ciphertext: string
  nonce: string
  created_at: string
  updated_at: string
}

interface LoginPlaintextData {
  username: string
  email: string
  password: string
  url: string
  notes: string
}

function getVaultKey(): Uint8Array<ArrayBufferLike> | null {
  return useGlobalStore.getState().cryptoContext?.vaultKey ?? null
}

function serializeLoginData(data: LoginPlaintextData): string {
  return JSON.stringify(data)
}

function deserializeLoginData(json: string): LoginPlaintextData {
  try {
    return JSON.parse(json)
  } catch {
    return { username: "", email: "", password: "", url: "", notes: "" }
  }
}

export function useLoginActions() {
  const loadLogins = useCallback(async (vaultId: string): Promise<Login[]> => {
    console.log(`[loadLogins] Starting load for vault ${vaultId}`)
    const vaultKey = getVaultKey()
    if (!vaultKey) {
      console.warn("[loadLogins] Vault key is null, returning empty array")
      return []
    }

    const { status, response } = await getLogins(vaultId)
    if (!status) {
      console.warn(`[loadLogins] API returned non-ok status for vault ${vaultId}`)
      return []
    }

    const encryptedLogins: EncryptedLoginPayload[] = response.user_logins ?? []
    console.log(`[loadLogins] Loaded ${encryptedLogins.length} encrypted logins from API`)

    const decrypted: Login[] = await Promise.all(
      encryptedLogins.map(async (enc) => {
        try {
          const plaintext = await decryptXChaCha(enc.ciphertext, enc.nonce, vaultKey)
          const data = deserializeLoginData(plaintext)
          return {
            id: enc.id,
            vaultId,
            title: enc.title,
            username: data.username ?? "",
            email: data.email ?? "",
            password: data.password ?? "",
            url: data.url ?? "",
            notes: data.notes ?? "",
            created_at: enc.created_at ?? "",
            updated_at: enc.updated_at ?? "",
          }
        } catch {
          return {
            id: enc.id,
            vaultId,
            title: enc.title,
            username: "",
            email: "",
            password: "",
            url: "",
            notes: "",
            created_at: enc.created_at ?? "",
            updated_at: enc.updated_at ?? "",
          }
        }
      })
    )

    console.log(`[loadLogins] Decrypted ${decrypted.length} logins successfully`)
    return decrypted
  }, [])

  const createLogin = useCallback(
    async (
      vaultId: string,
      data: Omit<Login, "id" | "created_at" | "updated_at">
    ): Promise<{ success: boolean; error?: string; details?: any }> => {
      console.log("[createLogin] Starting create login flow", { vaultId, title: data.title })

      // Step 1: Check vault key
      const vaultKey = getVaultKey()
      if (!vaultKey) {
        console.error("[createLogin] FAIL: vaultKey is null - crypto context not initialized")
        return { success: false, error: "Vault key not available - please unlock your vault first" }
      }
      console.log("[createLogin] Vault key retrieved successfully")

      // Step 2: Prepare plaintext data
      const plaintextData: LoginPlaintextData = {
        username: data.username,
        email: data.email,
        password: data.password,
        url: data.url,
        notes: data.notes,
      }
      console.log("[createLogin] Serialized login data", { username: data.username, email: data.email, url: data.url })

      // Step 3: Encrypt with comprehensive error handling
      let ciphertext: string
      let nonce: string
      try {
        console.log("[createLogin] Starting encryption...")
        const encrypted = await encryptXChaCha(
          serializeLoginData(plaintextData),
          vaultKey
        )
        ciphertext = encrypted.ciphertext
        nonce = encrypted.nonce
        console.log("[createLogin] Encryption successful", {
          ciphertextLength: ciphertext.length,
          nonceLength: nonce.length,
        })
      } catch (encryptError) {
        console.error("[createLogin] FAIL: Encryption threw an error", encryptError)
        return {
          success: false,
          error: `Encryption failed: ${encryptError instanceof Error ? encryptError.message : "Unknown error"}`,
          details: encryptError,
        }
      }

      // Step 4: API call with detailed logging
      console.log("[createLogin] Calling API createLogin endpoint...")
      const apiResult = await apiCreateLogin(vaultId, data.title, {
        ciphertext,
        nonce,
      })
      console.log("[createLogin] API response received", {
        status: apiResult.status,
        response: apiResult.response,
      })

      if (!apiResult.status) {
        console.error("[createLogin] FAIL: API returned non-ok status", apiResult.response)
        return {
          success: false,
          error: apiResult.response?.message || apiResult.response?.error || "API request failed",
          details: apiResult.response,
        }
      }

      console.log("[createLogin] SUCCESS: Login created successfully")
      return { success: true }
    },
    []
  )

  const modifyLogin = useCallback(
    async (
      vaultId: string,
      loginId: string,
      data: Partial<Login>
    ): Promise<{ success: boolean; error?: string; details?: any }> => {
      console.log("[modifyLogin] Starting modify login flow", { vaultId, loginId, title: data.title })

      const vaultKey = getVaultKey()
      if (!vaultKey) {
        console.error("[modifyLogin] FAIL: vaultKey is null")
        return { success: false, error: "Vault key not available" }
      }

      const plaintextData: LoginPlaintextData = {
        username: data.username ?? "",
        email: data.email ?? "",
        password: data.password ?? "",
        url: data.url ?? "",
        notes: data.notes ?? "",
      }

      let ciphertext: string
      let nonce: string
      try {
        console.log("[modifyLogin] Encrypting updated data...")
        const encrypted = await encryptXChaCha(
          serializeLoginData(plaintextData),
          vaultKey
        )
        ciphertext = encrypted.ciphertext
        nonce = encrypted.nonce
        console.log("[modifyLogin] Encryption successful", {
          ciphertextLength: ciphertext.length,
          nonceLength: nonce.length,
        })
      } catch (encryptError) {
        console.error("[modifyLogin] FAIL: Encryption error", encryptError)
        return {
          success: false,
          error: `Encryption failed: ${encryptError instanceof Error ? encryptError.message : "Unknown error"}`,
          details: encryptError,
        }
      }

      console.log("[modifyLogin] Calling API modifyLogin endpoint...")
      const apiResult = await apiModifyLogin(
        vaultId,
        loginId,
        data.title ?? "",
        { ciphertext, nonce }
      )
      console.log("[modifyLogin] API response", { status: apiResult.status, response: apiResult.response })

      if (!apiResult.status) {
        console.error("[modifyLogin] FAIL: API returned non-ok status", apiResult.response)
        return {
          success: false,
          error: apiResult.response?.message || apiResult.response?.error || "API request failed",
          details: apiResult.response,
        }
      }

      console.log("[modifyLogin] SUCCESS: Login modified successfully")
      return { success: true }
    },
    []
  )

  const deleteLogin = useCallback(
    async (
      vaultId: string,
      loginId: string
    ): Promise<{ success: boolean; needPassword?: boolean }> => {
      const startResult = await startDeleteLogin()
      if (!startResult.status) return { success: false }

      const challenge = startResult.response?.challenge
      if (!challenge) return { success: false }

      const signature = await signChallenge(challenge)
      if (!signature) {
        return { success: false, needPassword: true }
      }

      const finishResult = await finishDeleteLogin(vaultId, loginId, signature)
      return { success: !!finishResult.status }
    },
    []
  )

  return { loadLogins, createLogin, modifyLogin, deleteLogin }
}
