import { create } from "zustand"
import type { OverlaySheetState } from "./useOverLaySheetTypes.d"
import type { ButtonAction, TopButton } from "./useBottomSheetTypes.d"

export const useOverlaySheetStore = create<OverlaySheetState>((set, get) => ({
    isOpen: false,
    content: null,
    contentHandle: null,

    openOverlay: (content, contentHandleData) => {
        set({
            isOpen: true,
            content,
            contentHandle: contentHandleData ?? null,
        })
    },

    closeOverlay: () => {
        set({ isOpen: false, content: null })
    },

    getHandleButtonsProps: (id: ButtonAction) => {
        const btn = get().contentHandle?.buttons.find(
            (btn: TopButton) => btn.action === id
        )
        return btn ? btn.props : false
    },

    changeBtnValue: (btnAction: ButtonAction) => {
        const { contentHandle } = useOverlaySheetStore.getState()
        contentHandle &&
            set({
                contentHandle: {
                    buttons: contentHandle.buttons.map((btn) => {
                        if (btn.action === btnAction) btn.status = true
                        return btn
                    }),
                },
            })
    },
}))
