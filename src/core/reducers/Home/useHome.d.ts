export interface HomeState {
    filterOptions: FilterOption[],
    vaultOptions: Option[],
    filterData: Vault[]

}

export interface FilterOption {
    name: string,
    status: boolean,
    tags: keyof Vault
}


export interface Option {
    name: string,
    status: boolean,
    tags: "show" | "modify" | "delete"
}

export interface Vault {
    id: string,
    name: string,
    settings: VaultConfig,
    created_at: string,
    updated_at: string
}

export interface VaultConfig {
    icon: string,
    colors: Colors
}

export interface Colors {
    icColor: string,
    bgColor: string
}

export type HomeAction = 
    | {type: "SET_FILTER_OPTIONS", payload: {index: number}}
    | {type: "SET_VAULT_OPTIONS", payload: {tag:  "show" | "modify" | "delete", value: boolean}}
    | {type: "INIT_FILTER_OPTIONS", payload: {filterOptions: FilterOption[]}}
    | {type: "INIT_VAULT_OPTIONS", payload: {vaultOptions: Option[]}}
    | {type: "FILTER_VAULTS", payload: {vaults: Vault[], inputValue: string}}
