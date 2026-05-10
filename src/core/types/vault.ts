export interface Vault {
    id: string
    name: string
    settings: VaultConfig
    created_at: string
    updated_at: string
}

export interface VaultConfig {
    icon: string
    colors: Colors
}

export interface Colors {
    icColor: string
    bgColor: string
}
