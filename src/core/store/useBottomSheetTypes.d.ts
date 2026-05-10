import type { ComponentType, ReactNode } from "react"

export interface BottomSheetState {
    isOpen: boolean
    content: ReactNode | null
    contentHandle: ContentHandleData | null
    openSheet: (content: ReactNode, contentHandleData?: ContentHandleData) => void
    closeSheet: () => void
    getHandleButtonsProps: (id: ButtonAction) => TopButtonProps | false
    changeBtnValue: (btnAction: ButtonAction) => void
    changeVault: (newProps: TopButtonProps) => void
}

export interface ContentHandleData {
    buttons: TopButton[]
}

export interface TopButton {
    content: ComponentType<Record<string, unknown>>
    action: ButtonAction
    props: TopButtonProps
    status: boolean
}

export interface TopButtonProps {
    txt: string
    txtColor: string
    bgColor: string
    icLeft?: string
    icRight?: string
}

export type ButtonAction = "add" | "modify" | "delete" | "change" | "verify"
