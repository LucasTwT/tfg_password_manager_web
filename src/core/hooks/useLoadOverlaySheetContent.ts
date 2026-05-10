import { useEffect } from "react"
import { useOverlaySheetStore } from "@/core/store/useOverLaySheet"

export function useLoadOverlaySheetContent() {
    const { content, isOpen } = useOverlaySheetStore()

    useEffect(() => {
        if (!content || !isOpen) return

        const frameId = requestAnimationFrame(() => {
            // Overlay content is ready — UI layer handles the actual animation
        })

        return () => {
            cancelAnimationFrame(frameId)
        }
    }, [content, isOpen])
}
