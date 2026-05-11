import { useTranslation } from "react-i18next"
import { Moon, Sun, X, LogOut } from "lucide-react"
import { useTheme } from "@/app/providers/ThemeProvider"
import { useAppDispatch, useAppState } from "@/app/context/AppContext"
import { useGlobalStore } from "@/core/store/useGlobalStore"
import { logout } from "@/core/services/api/endpoints/auth"
import { Button } from "@/app/components/ui/button"
import { Label } from "@/app/components/ui/label"
import { useNavigate } from "react-router-dom"
import i18n from "@/core/i18n"
import { ThemeButton } from "./ThemeButton"
import { LangButton } from "./LangButton"

export function SettingsModal() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const { settingsOpen } = useAppState()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { settings, updateSettings, clearKeys } = useGlobalStore()

  if (!settingsOpen) return null

  const handleClose = () => {
    dispatch({ type: "TOGGLE_SETTINGS" })
  }

  const handleThemeChange = (newTheme: "dark" | "light") => {
    setTheme(newTheme)
  }

  const handleLanguageChange = (lang: "es" | "en") => {
    i18n.changeLanguage(lang)
    updateSettings({ ...settings, lang })
  }

  const handleLogout = async () => {
    await logout()
    clearKeys()
    navigate("/login")
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {t("app.settings.title")}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleClose}
            aria-label={t("app.settings.close")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Appearance */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-[var(--foreground)]">
              {t("app.settings.appearance")}
            </Label>
            <div className="space-y-2">
              <Label className="text-sm text-[var(--muted-foreground)]">
                {t("app.settings.theme")}
              </Label>
              <div className="flex gap-2">
                <ThemeButton
                  active={theme === "dark"}
                  onClick={() => handleThemeChange("dark")}
                  icon={<Moon className="h-4 w-4" />}
                  label={t("app.settings.themeDark")}
                />
                <ThemeButton
                  active={theme === "light"}
                  onClick={() => handleThemeChange("light")}
                  icon={<Sun className="h-4 w-4" />}
                  label={t("app.settings.themeLight")}
                />
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-[var(--foreground)]">
              {t("app.settings.language")}
            </Label>
            <div className="flex gap-2">
              <LangButton
                active={settings.lang === "es"}
                onClick={() => handleLanguageChange("es")}
                label="Español"
              />
              <LangButton
                active={settings.lang === "en"}
                onClick={() => handleLanguageChange("en")}
                label="English"
              />
            </div>
          </div>

          {/* Security */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-[var(--foreground)]">
              {t("app.settings.security")}
            </Label>
            <Button variant="outline" className="w-full justify-start" disabled>
              {t("app.settings.changePassword")}
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled>
              {t("app.settings.exportVaults")}
            </Button>
          </div>

          {/* Logout */}
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            {t("app.settings.logout")}
          </Button>
        </div>
      </div>
    </div>
  )
}
