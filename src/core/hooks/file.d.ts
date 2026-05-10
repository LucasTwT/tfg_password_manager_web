export type Chunk = ChunkEntry[]

export interface ChunkEntry {
    ciphertextB64: string
    nonceB64: string
    offset: number
}

export interface FileData {
    fileName: string
    tags: string
    note: string
    chunks: Chunk
}
