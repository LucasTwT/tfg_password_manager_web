import { ensureSodiumReady } from '@/core/services/crypto/init'
import { storage } from './index'
import type { StorageAPI } from './types'

/**
 * Creates a storage wrapper that encrypts/decrypts values with crypto_secretbox_easy
 * before delegating to the underlying StorageAPI.
 *
 * @param getKey - Function returning the current encryption key (Uint8Array), or null if unavailable
 * @returns A StorageAPI-compatible object with transparent encryption
 */
export function createSecureStorage(getKey: () => Uint8Array | null): StorageAPI {
  return {
    async get<T>(key: string): Promise<T | null> {
      const encrypted = await storage.get<string>(key)
      if (!encrypted) return null

      const s = await ensureSodiumReady()
      const keyBytes = getKey()
      if (!keyBytes) throw new Error('No encryption key available')

      const combined = s.from_base64(encrypted, s.base64_variants.ORIGINAL)
      const nonce = combined.subarray(0, 24)
      const ciphertext = combined.subarray(24)

      const decrypted = s.crypto_secretbox_open_easy(ciphertext, nonce, keyBytes)
      return JSON.parse(s.to_string(decrypted)) as T
    },

    async set<T>(key: string, value: T): Promise<void> {
      const s = await ensureSodiumReady()
      const keyBytes = getKey()
      if (!keyBytes) throw new Error('No encryption key available')

      const nonce = s.randombytes_buf(24)
      const encrypted = s.crypto_secretbox_easy(
        new TextEncoder().encode(JSON.stringify(value)),
        nonce,
        keyBytes,
      )

      // Store nonce + ciphertext as single base64 string
      const combined = s.to_base64(
        new Uint8Array([...nonce, ...encrypted]),
        s.base64_variants.ORIGINAL,
      )
      await storage.set(key, combined)
    },

    async delete(key: string): Promise<void> {
      await storage.delete(key)
    },
  }
}
