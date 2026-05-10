import { useEffect } from "react"
import { usePopoverStore } from "@/core/store/usePopoverStore"

export function useLoadPopover() {
    const { anchorRef, selectedVault, setAnchorRef, setSelectedVault } = usePopoverStore()

    useEffect(() => {
        if (!anchorRef || !selectedVault) return

        const frameId = requestAnimationFrame(() => {
            setAnchorRef(null)
            setSelectedVault(null)
        })

        return () => {
            cancelAnimationFrame(frameId)
        }
    }, [selectedVault, anchorRef])
}
