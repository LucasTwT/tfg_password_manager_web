import sodium from "libsodium-wrappers"
import { ensureSodiumReady } from "../init"

export async function decryptXChaCha(
    ciphertext: string,
    nonce: string,
    keyHex: Uint8Array<ArrayBufferLike>
) {
    await ensureSodiumReady()
    const additionalData = ""
    const plaintextBytes = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
        null,
        sodium.from_base64(ciphertext),
        additionalData,
        sodium.from_base64(nonce),
        keyHex
    )
    return sodium.to_string(plaintextBytes)
}

export async function encryptXChaCha(
    plaintext: string,
    key: Uint8Array<ArrayBufferLike>
) {
    await ensureSodiumReady()
    const messageBytes = new TextEncoder().encode(plaintext)
    const nonce = sodium.randombytes_buf(24)
    const additionalData = ""

    const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
        messageBytes,
        additionalData,
        null,
        nonce,
        key
    )

    return {
        ciphertext: sodium.to_base64(ciphertext),
        nonce: sodium.to_base64(nonce),
    }
}
