import type { KeyPair } from "libsodium-wrappers"
import type { KdfParams } from "./constants/argon2idParams"

export interface CryptoContext {
    vaultKey: Uint8Array<ArrayBufferLike>
    authKey: Uint8Array<ArrayBufferLike>
    signingKeys: KeyPair
}

export interface HashResult {
    hash: Uint8Array<ArrayBufferLike>
    salt: string
    kdfParams: KdfParams
}

export interface EncryptedData {
    ciphertext: string
    nonce: string
}

export interface FileChunk {
    ciphertextB64: string
    nonceB64: string
    offset: number
}

export type Chunk = FileChunk[]

export interface FileData {
    fileName: string
    tags: string
    note: string
    chunks: Chunk
}

export type { KdfParams }
