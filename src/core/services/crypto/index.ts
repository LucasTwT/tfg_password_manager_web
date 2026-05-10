// Init
export { ensureSodiumReady } from "./init"

// Types
export type {
    CryptoContext,
    HashResult,
    EncryptedData,
    FileChunk,
    Chunk,
    FileData,
    KdfParams,
} from "./types"

// Hash functions
export {
    regenerateKeys,
    hashMasterPassword,
    deriveKey,
    keypairFromSeed,
    signChallenge,
    generateSalt,
} from "./functions/hash"

// ChaCha text encryption
export { encryptXChaCha, decryptXChaCha } from "./functions/chachaTextData"

// ChaCha file encryption
export {
    downloadAndDecryptFile,
    encryptChunk,
    readEncryptFileChunks,
    uploadEncryptedFile,
    decryptChunkXChaCha,
} from "./functions/chachaFiles"

// ChaCha helpers
export { hexToUint8 } from "./functions/chachaFunctions"

// Password generation
export { generatePassword, generateRandomPassword } from "./functions/generatePassword"

// Constants
export { KDF_PARAMS } from "./constants/argon2idParams"
export { PASSWORD_CONSTANTS, WORD_LIST } from "./constants/passwords"
export { CHUNK_SIZE } from "./constants/files"
export { CIPHER, VERSION } from "./constants/cipher"
