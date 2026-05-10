import { create } from "zustand"
import type { PopoverState } from "./usePopoverStoreTypes"
import type { Vault } from "@/core/types/vault"
import type { RefObject } from "react"

export const usePopoverStore = create<PopoverState>((set) => ({
    anchorRef: null,
    selectedVault: null,
    isVisible: false,
    changeVisible: (newVal: boolean) => set({ isVisible: newVal }),
    setSelectedVault: (content: Vault) => set({ selectedVault: content }),
    setAnchorRef: (ref: RefObject<HTMLElement>) => set({ anchorRef: ref })
}))
