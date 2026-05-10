export interface KdfParams {
    hashLength: number
    iterations: number
    memory: number
    parallelism: number
    mode: "argon2id"
}

export const KDF_PARAMS: KdfParams = {
    hashLength: 32,
    iterations: 3,
    memory: 131072,
    parallelism: 1,
    mode: "argon2id",
}
