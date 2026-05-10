export interface Button {
    text: string
    style: "default" | "cancel" | "destructive" | undefined
    onPress?: () => void
}
