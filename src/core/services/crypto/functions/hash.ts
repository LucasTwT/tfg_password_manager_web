import sodium from "libsodium-wrappers"
import { argon2id } from "hash-wasm"
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
    const hash = await hashMasterPassword(masterPassword, salt, params)
    const vaultKey = await deriveKey(hash, "VAULT")
    const authKey = await deriveKey(hash, "AUTH")
    const keys = await keypairFromSeed(authKey)
    updateCryptoContext({ authKey, vaultKey, signingKeys: keys })
}

export async function hashMasterPassword(
    password: string,
    salt: string,
    kdfParams: KdfParams
): Promise<Uint8Array> {
    const hash = await argon2id({
        password,
        salt,
        parallelism: kdfParams.parallelism,
        iterations: kdfParams.iterations,
        memorySize: kdfParams.memory, // KiB (131072 = 128MB)
        hashLength: kdfParams.hashLength,
        outputType: "binary",
    })
    return hash
}

export async function deriveKey(
    rootKey: Uint8Array,
    context: "VAULT" | "AUTH"
) {
    await ensureSodiumReady()
    const ctx = context.padEnd(8, "\0").slice(0, 8)
    return sodium.crypto_kdf_derive_from_key(
        32,
        1,
        ctx,
        rootKey
    )
}

export async function keypairFromSeed(authKey: Uint8Array) {
    await ensureSodiumReady()
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
