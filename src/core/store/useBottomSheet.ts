import { create } from "zustand"
import type { BottomSheetState, ButtonAction, TopButton, TopButtonProps } from "./useBottomSheetTypes.d"

export const useBottomSheetStore = create<BottomSheetState>((set, get) => ({
    isOpen: false,
    content: null,
    contentHandle: null,

    openSheet: (content, contentHandleData) => {
        set({
            isOpen: true,
            content,
            contentHandle: contentHandleData ?? null,
        })
    },

    closeSheet: () => {
        set({ isOpen: false, content: null })
    },

    getHandleButtonsProps: (id: ButtonAction) => {
        const btn = get().contentHandle?.buttons.find(
            (btn: TopButton) => btn.action === id
        )
        return btn ? btn.props : false
    },

    changeBtnValue: (btnAction: ButtonAction) => {
        const { contentHandle } = useBottomSheetStore.getState()
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

    changeVault: (newProps: TopButtonProps) => {
        const { contentHandle } = useBottomSheetStore.getState()
        contentHandle &&
            set({
                contentHandle: {
                    buttons: contentHandle.buttons.map((btn) => {
                        if (btn.action === "change") btn.props = newProps
                        return btn
                    }),
                },
            })
    }
}))
