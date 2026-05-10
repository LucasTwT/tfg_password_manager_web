import sodium from "libsodium-wrappers"
import { ensureSodiumReady } from "../init"
import { hexToUint8 } from "./chachaFunctions"
import { encryptXChaCha } from "./chachaTextData"
import { CHUNK_SIZE } from "../constants/files"
import type { FileData, Chunk } from "../types"

export async function downloadAndDecryptFile(
    fileData: FileData,
    chunks: Chunk,
    keyHex: string
): Promise<Blob> {
    await ensureSodiumReady()
    const parts: Uint8Array[] = []

    for (const { ciphertextB64, nonceB64 } of chunks) {
        const plaintextChunk = decryptChunkXChaCha(ciphertextB64, nonceB64, keyHex)
        parts.push(plaintextChunk)
    }

    return new Blob(parts)
}

export async function encryptChunk(
    chunkBytes: Uint8Array<ArrayBufferLike>,
    chunkIndex: number,
    key: string
) {
    await ensureSodiumReady()
    const keyUnit8 = hexToUint8(key)
    const nonce = sodium.randombytes_buf(
        sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES
    )
    const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
        chunkBytes,
        "",
        null,
        nonce,
        keyUnit8
    )

    return {
        nonce,
        ciphertext,
        index: chunkIndex,
    }
}

export async function* readEncryptFileChunks(file: File, key: string) {
    await ensureSodiumReady()
    const size = file.size
    let offset = 0
    let index = 0

    while (offset < size) {
        const readLength = Math.min(CHUNK_SIZE, size - offset)
        const slice = file.slice(offset, offset + readLength)
        const chunkBytes = new Uint8Array(await slice.arrayBuffer())

        const { nonce, ciphertext } = await encryptChunk(chunkBytes, index, key)

        yield {
            ciphertext,
            nonce,
            offset,
            index,
        }

        offset += readLength
        index++
    }
}

export async function uploadEncryptedFile(
    file: FileData,
    key: string,
    webFile: File
) {
    await ensureSodiumReady()
    const chunks: Chunk = []

    const { ciphertext, nonce } = await encryptXChaCha(JSON.stringify(file), hexToUint8(key))

    for await (const chunk of readEncryptFileChunks(webFile, key)) {
        chunks.push({
            ciphertextB64: sodium.to_base64(chunk.ciphertext),
            nonceB64: sodium.to_base64(chunk.nonce),
            offset: chunk.offset,
        })
    }

    return {
        metadataFile: { ciphertext, nonce },
        fileChunks: chunks,
    }
}

export function decryptChunkXChaCha(
    cipherB64: string,
    nonceB64: string,
    keyHex: string
): Uint8Array {
    const key = hexToUint8(keyHex)
    const ciphertext = sodium.from_base64(cipherB64)
    const nonce = sodium.from_base64(nonceB64)

    return sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
        null,
        ciphertext,
        "",
        nonce,
        key
    )
}
