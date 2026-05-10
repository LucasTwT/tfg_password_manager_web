export function validateIdentifier(identifier: string, t: (key: string) => string) {
    if (!identifier || identifier.trim() === "")
        return t("auth.login.validations.identifierRequired")
    return ""
}

export function validatePassword(password: string, t: (key: string) => string) {
    if (!password || password.trim() === "")
        return t("auth.login.validations.passwordRequired")
    return ""
}
