export function validateUsername(
  username: string,
  t: (key: string) => string
): string {
  if (!username || username.trim() === "")
    return t("auth.register.validations.usernameRequired")
  if (!/^[a-zA-Z0-9_-]{3,20}$/.test(username))
    return t("auth.register.validations.usernameInvalid")
  return ""
}

export function validateEmail(
  email: string,
  t: (key: string) => string
): string {
  if (!email || email.trim() === "")
    return t("auth.register.validations.emailRequired")
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return t("auth.register.validations.emailInvalid")
  return ""
}

export function validatePassword(
  password: string,
  t: (key: string) => string
): string {
  if (!password || password.trim() === "")
    return t("auth.register.validations.passwordRequired")
  if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[^A-Za-z0-9]/.test(password)
  )
    return t("auth.register.validations.passwordInvalid")
  return ""
}
