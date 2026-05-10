import { useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { useLoginReducer } from "@/core/reducers/Auth/useLogin"
import { useLoginUser } from "@/core/hooks/Auth/useLogin"
import { useValidation } from "@/core/hooks/Auth/useValidations"
import { validateIdentifier, validatePassword } from "@/core/utils/validations/Login"

export default function Login() {
  const { t } = useTranslation()
  const { state, setUserdata, setErrors, setRequestError } = useLoginReducer()
  const [pressed, setPressed] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [identifierFocused, setIdentifierFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  useLoginUser(state, pressed, setPressed, setRequestError)

  useValidation({
    validationFun: (input) => validateIdentifier(input, t),
    setError: (value) =>
      setErrors({ field: "identifier", value: typeof value === "function" ? value("") : value }),
    isFocused: identifierFocused,
    input: state.userdata.identifier,
  })

  useValidation({
    validationFun: (input) => validatePassword(input, t),
    setError: (value) =>
      setErrors({ field: "password", value: typeof value === "function" ? value("") : value }),
    isFocused: passwordFocused,
    input: state.userdata.password,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setRequestError({ title: "", msg: "" })
    setPressed(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="identifier">{t("auth.login.usernameField.label")}</Label>
        <Input
          id="identifier"
          placeholder={t("auth.login.usernameField.placeholder")}
          value={state.userdata.identifier}
          onChange={(e) =>
            setUserdata({ field: "identifier", value: e.target.value })
          }
          onFocus={() => setIdentifierFocused(true)}
          onBlur={() => setIdentifierFocused(false)}
          autoComplete="username"
        />
        {state.errors.identifier && (
          <p className="text-sm text-[var(--destructive)]">
            {state.errors.identifier}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("auth.login.passwordField.label")}</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.login.passwordField.placeholder")}
            value={state.userdata.password}
            onChange={(e) =>
              setUserdata({ field: "password", value: e.target.value })
            }
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            autoComplete="current-password"
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
            {t("auth.login.btnLogin")}
          </>
        ) : (
          t("auth.login.btnLogin")
        )}
      </Button>

      <p className="text-center text-sm text-[var(--muted-foreground)]">
        {t("auth.login.linkToRegister")}{" "}
        <Link
          to="/register"
          className="text-[var(--primary)] hover:underline font-medium"
        >
          {t("auth.register.title")}
        </Link>
      </p>
    </form>
  )
}
