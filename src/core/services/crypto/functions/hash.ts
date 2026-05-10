import sodium from "libsodium-wrappers"
import { ensureSodiumReady } from "../init"
import { KDF_PARAMS } from "../constants/argon2idParams"
import type { KdfParams } from "../types"
import { useGlobalStore } from "@/core/store/useGlobalStore"

export async function regenerateKeys(
    masterPassword: string,
    salt: string,
    kdfParams?: KdfParams
) {
    const { updateCryptoContext } = useGlobalStore.getState()
    const params = kdfParams ?? KDF_PARAMS
    const { hash } = await hashMasterPassword(masterPassword, salt, params)
    const vaultKey = deriveKey(hash, "VAULT")
    const authKey = deriveKey(hash, "AUTH")
    const keys = keypairFromSeed(authKey)
    updateCryptoContext({ authKey, vaultKey, signingKeys: keys })
}

export async function hashMasterPassword(
    password: string,
    salt: string,
    kdfParams: KdfParams
) {
    await ensureSodiumReady()
    const hash = sodium.crypto_pwhash(
        kdfParams.hashLength,
        sodium.from_string(password),
        sodium.from_base64(salt, sodium.base64_variants.ORIGINAL),
        kdfParams.iterations,
        kdfParams.memory,
        sodium.crypto_pwhash_ALG_ARGON2ID13
    )
    return { hash, salt, kdfParams }
}

export function deriveKey(
    rootKey: Uint8Array<ArrayBufferLike>,
    context: "VAULT" | "AUTH"
) {
    const ctx = context.padEnd(8, "\0").slice(0, 8)
    return sodium.crypto_kdf_derive_from_key(
        32,
        1,
        ctx,
        rootKey
    )
}

export function keypairFromSeed(authKey: Uint8Array<ArrayBufferLike>) {
    return sodium.crypto_sign_seed_keypair(authKey)
}

export async function signChallenge(challengeBase64: string) {
    await ensureSodiumReady()
    const { cryptoContext, canSign } = useGlobalStore.getState()
    const challengeBytes = sodium.from_base64(
        challengeBase64,
        sodium.base64_variants.ORIGINAL
    )
    if (canSign() && cryptoContext) {
        return sodium.to_base64(
            sodium.crypto_sign_detached(
                challengeBytes,
                cryptoContext.signingKeys.privateKey
            ),
            sodium.base64_variants.ORIGINAL
        )
    }
    return false
}

export async function generateSalt() {
    await ensureSodiumReady()
    const saltBytes = sodium.randombytes_buf(16)
    return sodium.to_base64(saltBytes, sodium.base64_variants.ORIGINAL)
}
