import { useEffect } from "react"
import type { RequestError } from "@/core/reducers/Auth/useRegister.d"

interface AlertButton {
    text: string
    onPress?: () => void
}

export function useAlert({
    title,
    msg,
    buttons,
    input,
    validationFun,
    onAlert,
}: {
    title: string
    msg: string
    buttons: AlertButton[]
    input: RequestError
    validationFun: (input: RequestError) => void
    onAlert?: (title: string, msg: string, buttons: AlertButton[]) => void
}) {
    useEffect(() => {
        if (input.title !== "") {
            if (onAlert) {
                onAlert(title, msg, buttons)
            } else {
                // Default: use window.alert
                window.alert(`${title}: ${msg}`)
                buttons.forEach((btn) => btn.onPress?.())
            }
        }
    }, [input, validationFun])
}
