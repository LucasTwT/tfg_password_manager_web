import { useEffect, type Dispatch, type SetStateAction } from "react"

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
    useEffect(() => {
        setError(validationFun(input))
    }, [isFocused, input])
}
