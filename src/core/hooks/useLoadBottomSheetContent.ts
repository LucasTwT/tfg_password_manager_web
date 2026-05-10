import { useEffect } from "react"
import { useBottomSheetStore } from "@/core/store/useBottomSheet"

export function useLoadBottomSheetContent() {
    const { content, isOpen } = useBottomSheetStore()

    useEffect(() => {
        if (!content || !isOpen) return

        const frameId = requestAnimationFrame(() => {
            // Bottom sheet content is ready — UI layer handles the actual animation
        })

        return () => {
            cancelAnimationFrame(frameId)
        }
    }, [content, isOpen])
}
