import { useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { useRegisterReducer } from "@/core/reducers/Auth/useRegister"
import { useCreateUser } from "@/core/hooks/Auth/useCreateUser"
import { useValidation } from "@/core/hooks/Auth/useValidations"
import {
  validateUsername,
  validateEmail,
  validatePassword,
} from "@/core/utils/validations/Register"

function getPasswordStrength(password: string): {
  label: string
  color: string
  width: string
} {
  if (!password) return { label: "", color: "", width: "w-0" }

  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) return { label: "Weak", color: "bg-[var(--destructive)]", width: "w-1/3" }
  if (score <= 4) return { label: "Medium", color: "bg-[var(--warning)]", width: "w-2/3" }
  return { label: "Strong", color: "bg-[var(--success)]", width: "w-full" }
}

export default function Register() {
  const { t } = useTranslation()
  const { state, setUserdata, setErrors, setRequestError } =
    useRegisterReducer()
  const [pressed, setPressed] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [confirmError, setConfirmError] = useState("")
  const [usernameFocused, setUsernameFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  useCreateUser(state, pressed, setPressed, setRequestError)

  useValidation({
    validationFun: (input) => validateUsername(input, t),
    setError: (value) =>
      setErrors({ field: "username", value: typeof value === "function" ? value("") : value }),
    isFocused: usernameFocused,
    input: state.userdata.username,
  })

  useValidation({
    validationFun: (input) => validateEmail(input, t),
    setError: (value) =>
      setErrors({ field: "email", value: typeof value === "function" ? value("") : value }),
    isFocused: emailFocused,
    input: state.userdata.email,
  })

  useValidation({
    validationFun: (input) => validatePassword(input, t),
    setError: (value) =>
      setErrors({ field: "password", value: typeof value === "function" ? value("") : value }),
    isFocused: passwordFocused,
    input: state.userdata.password,
  })

  const strength = getPasswordStrength(state.userdata.password)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Check confirm password
    if (confirmPassword !== state.userdata.password) {
      setConfirmError("Passwords do not match.")
      return
    }
    setConfirmError("")

    setRequestError({ title: "", msg: "" })
    setPressed(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t("auth.register.emailField.label")}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t("auth.register.emailField.placeholder")}
          value={state.userdata.email}
          onChange={(e) =>
            setUserdata({ field: "email", value: e.target.value })
          }
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          autoComplete="email"
        />
        {state.errors.email && (
          <p className="text-sm text-[var(--destructive)]">
            {state.errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">
          {t("auth.register.usernameField.label")}
        </Label>
        <Input
          id="username"
          placeholder={t("auth.register.usernameField.placeholder")}
          value={state.userdata.username}
          onChange={(e) =>
            setUserdata({ field: "username", value: e.target.value })
          }
          onFocus={() => setUsernameFocused(true)}
          onBlur={() => setUsernameFocused(false)}
          autoComplete="username"
        />
        {state.errors.username && (
          <p className="text-sm text-[var(--destructive)]">
            {state.errors.username}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-password">
          {t("auth.register.passwordField.label")}
        </Label>
        <div className="relative">
          <Input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.register.passwordField.placeholder")}
            value={state.userdata.password}
            onChange={(e) =>
              setUserdata({ field: "password", value: e.target.value })
            }
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            autoComplete="new-password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {state.errors.password && (
          <p className="text-sm text-[var(--destructive)]">
            {state.errors.password}
          </p>
        )}
        {/* Password strength indicator */}
        {state.userdata.password && (
          <div className="space-y-1">
            <div className="h-1 w-full rounded-full bg-[var(--muted)]">
              <div
                className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
              />
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">
              {strength.label}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {confirmError && (
          <p className="text-sm text-[var(--destructive)]">{confirmError}</p>
        )}
      </div>

      {state.requestError.msg && (
        <div className="rounded-md bg-[var(--destructive)]/10 border border-[var(--destructive)]/20 p-3">
          <p className="text-sm text-[var(--destructive)]">
            {state.requestError.msg}
          </p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={pressed}>
        {pressed ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("auth.register.btnCreateUser")}
          </>
        ) : (
          t("auth.register.btnCreateUser")
        )}
      </Button>

      <p className="text-center text-sm text-[var(--muted-foreground)]">
        {t("auth.register.linkToLogin")}{" "}
        <Link
          to="/login"
          className="text-[var(--primary)] hover:underline font-medium"
        >
          {t("auth.login.title")}
        </Link>
      </p>
    </form>
  )
}
