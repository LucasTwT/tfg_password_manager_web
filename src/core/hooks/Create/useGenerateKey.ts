import type { UpdatePayload } from "@/core/reducers/Create/useCreateLoginTypes"
import type { GenerateKeyState } from "@/core/reducers/Create/useGenerateKeyTypes"
import { useEffect } from "react"

export function useGenerateKey({
    state,
    regeneratePassword,
    setValue,
    onSelect,
}: {
    state: GenerateKeyState
    regeneratePassword: () => void
    setValue: (payload: UpdatePayload) => void
    onSelect?: (fn: () => void) => void
}) {
    // Regenerate password when options change
    useEffect(() => {
        regeneratePassword()
    }, [state.keyOptions, state.regenerateBtn])

    // Apply generated password function — caller triggers via onSelect callback
    const applyPassword = () => {
        setValue({ field: "password", value: state.password })
    }

    // Register select handler if provided
    useEffect(() => {
        if (onSelect) {
            onSelect(applyPassword)
        }
    }, [state.password])

    return { applyPassword }
}
