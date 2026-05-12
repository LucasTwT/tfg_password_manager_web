import { useGlobalStore } from "@/core/store/useGlobalStore"
import { getSettings } from "@/core/services/api/endpoints/users"
import { useTheme } from "@/app/providers/ThemeProvider"
import i18n from "@/core/i18n"

export function useFetchSettings() {
    const updateSettings = useGlobalStore((s) => s.updateSettings)
    const setUserInfo = useGlobalStore((s) => s.setUserInfo)

    async function fetchAndApplySettings() {
        const { response, status } = await getSettings()
        if (!status) return false

        const { settings, username, email } = response

        // Update store
        updateSettings(settings)
        setUserInfo(username, email)

        // Apply theme
        const root = document.documentElement
        root.classList.remove("light", "dark")
        if (settings.theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
            root.classList.add(systemTheme)
        } else {
            root.classList.add(settings.theme)
        }

        // Apply language
        i18n.changeLanguage(settings.lang)

        return true
    }

    return { fetchAndApplySettings }
}
