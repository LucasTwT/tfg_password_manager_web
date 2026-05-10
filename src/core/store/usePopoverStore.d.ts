import type { Vault } from "@/core/types/vault"
import type { RefObject } from "react"

export interface PopoverState {
    anchorRef: RefObject<HTMLElement> | null
    selectedVault: Vault | null
    isVisible: boolean
    setAnchorRef: (ref: RefObject<HTMLElement> | null) => void
    setSelectedVault: (content: Vault | null) => void
    changeVisible: (newVal: boolean) => void
}
