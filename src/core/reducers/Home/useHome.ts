import { useReducer } from "react";
import type { HomeState, HomeAction, FilterOption, Vault, Option} from "./useHomeTypes";

export const initialState: HomeState = {
    filterOptions: [],
    vaultOptions: [],
    filterData: []
} 

function reducer (state: HomeState, action: HomeAction): HomeState {
    const { type, payload } = action
    switch (type) {
        case "INIT_FILTER_OPTIONS": {
            return {
                ...state,
                filterOptions: payload.filterOptions
            }
        }
        case "INIT_VAULT_OPTIONS": {
            return {
                ...state,
                vaultOptions: payload.vaultOptions
            }
        }
        case "SET_FILTER_OPTIONS": {
            const filterOptions: FilterOption[] = setOptions(state.filterOptions, payload.index)
            return {
                ...state,
                filterOptions: filterOptions
            }
        }
        case "SET_VAULT_OPTIONS": {
            const vaultOptions: FilterOption[] = state.vaultOptions.map((opt) => {
                if (opt.tags === payload.tag) opt.status = payload.value
                return opt
            })
            return {
                ...state,
                vaultOptions: vaultOptions
            }            
        }

        case "FILTER_VAULTS": {
            const filterData = filterByString(state.filterOptions, payload.vaults, payload.inputValue)
            return {
                ...state, 
                filterData: filterData
            }         
        }

        default: {
            return state
        }
    }
} 

function setOptions (options: FilterOption[] | Option[], index: number) {
   return options.map((filter, idx) => {
                if (filter.status === true) {
                    filter.status = false
                } 
                if (idx === index){
                    filter.status = true
                }
                return filter
            })
}

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")         
    .replace(/[\u0300-\u036f]/g, "") 
    .trim();


function filterByString(options: FilterOption[], vaults: Vault[], inputValue: string) {
    const q = normalize(inputValue)
    let filterData: Vault[] = []
    options.forEach((option) => {
        if (option.status)
            filterData = vaults.filter((vault: Vault) => normalize(vault[option.tags]).includes(q))
    })
    return filterData
} 


export function useHomeReducer () {
    const [state, dispatch] = useReducer(reducer, initialState)
    const setFilterOptions = (payload: number) => dispatch({type: "SET_FILTER_OPTIONS", payload: {index: payload}}) 
    const setVaultOptions = (payload: {tag:  "show" | "modify" | "delete", value: boolean}) => dispatch({type: "SET_VAULT_OPTIONS", payload: {tag: payload.tag, value: payload.value}}) 
    const initFilterOptions = (payload: FilterOption[]) => dispatch({type: "INIT_FILTER_OPTIONS", payload: {filterOptions: payload}})
    const initVaultOptions = (payload: Option[]) => dispatch({type: "INIT_VAULT_OPTIONS", payload: {vaultOptions: payload}})
    const filterVaults = (payload: {vaults: Vault[], inputValue: string}) => dispatch({type: "FILTER_VAULTS", payload: payload})
    return { state, setFilterOptions, setVaultOptions, initFilterOptions, initVaultOptions, filterVaults }
}
