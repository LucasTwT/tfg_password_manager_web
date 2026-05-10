import type { ReactNode } from "react"
import type { ButtonAction, ContentHandleData, TopButtonProps } from "./useBottomSheetTypes"

export interface OverlaySheetState {
    isOpen: boolean
    content: ReactNode | null
    contentHandle: ContentHandleData | null
    openOverlay: (content: ReactNode, contentHandleData?: ContentHandleData) => void
    closeOverlay: () => void
    getHandleButtonsProps: (id: ButtonAction) => TopButtonProps | false
    changeBtnValue: (btnAction: ButtonAction) => void
}
