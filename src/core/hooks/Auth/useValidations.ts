import { useEffect, useRef, type Dispatch, type SetStateAction } from "react"

export const useValidation = ({
    validationFun,
    setError,
    isFocused,
    input,
}: {
    validationFun: (input: string) => string
    setError: Dispatch<SetStateAction<string>>
    isFocused: boolean
    input: string
}) => {
    const hasInteracted = useRef(false)

    useEffect(() => {
        // Mark as interacted when user focuses the field
        if (isFocused) {
            hasInteracted.current = true
        }
    }, [isFocused])

    useEffect(() => {
        // Only validate after user has interacted with the field
        if (!hasInteracted.current) return
        setError(validationFun(input))
    }, [isFocused, input])
}
