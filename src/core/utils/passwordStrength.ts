export function calculatePasswordStrength(password: string): number {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return Math.min(score, 4)
}

const STRENGTH_KEYS = [
  "",
  "passwordGenerator.strength.weak",
  "passwordGenerator.strength.fair",
  "passwordGenerator.strength.good",
  "passwordGenerator.strength.strong",
] as const

export function getPasswordStrengthLabel(strength: number): string {
  return STRENGTH_KEYS[strength]
}
