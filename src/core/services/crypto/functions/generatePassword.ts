import type { PasswordGeneratorOptions } from "@/core/reducers/Create/useGenerateKey.d"
import { PasswordType } from "@/core/reducers/Create/useGenerateKey.d"
import { PASSWORD_CONSTANTS, WORD_LIST } from "../constants/passwords"

export function generatePassword(keyOptions: PasswordGeneratorOptions): string {
    switch (keyOptions.type) {
        case PasswordType.memorable:
            return generateMemorable(keyOptions)
        case PasswordType.random:
            return generateRandomPassword(keyOptions)
    }
}

export function generateRandomPassword(
    opts: PasswordGeneratorOptions
): string {
    let charset = ""

    charset += PASSWORD_CONSTANTS.LOWERCASE
    if (opts.includeUppercase) charset += PASSWORD_CONSTANTS.UPPERCASE
    if (opts.includeNumbers) charset += PASSWORD_CONSTANTS.NUMBERS
    if (opts.includeSymbols) charset += PASSWORD_CONSTANTS.SYMBOLS

    if (!charset.length) {
        throw new Error("No character sets selected")
    }

    if (opts.avoidAmbiguous) {
        charset = charset
            .split("")
            .filter((ch) => !PASSWORD_CONSTANTS.AMBIGUOUS.includes(ch))
            .join("")
    }

    if (!charset.length) {
        throw new Error("Character set empty after filtering")
    }

    const length = Math.max(1, opts.length ?? 16)
    const chars = charset.split("")

    const canRepeat = opts.allowRepeating || chars.length < length

    if (!canRepeat) {
        const shuffled = [...chars]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const rand = getRandomByte() % (i + 1)
            ;[shuffled[i], shuffled[rand]] = [shuffled[rand], shuffled[i]]
        }
        return shuffled.slice(0, length).join("")
    }

    let password = ""
    for (let i = 0; i < length; i++) {
        password += chars[getRandomByte() % chars.length]
    }

    return password
}

function generateMemorable(opts: PasswordGeneratorOptions): string {
    const count = opts.wordsCount ?? 4
    const sep = "-"

    const words: string[] = []
    for (let i = 0; i < count; i++) {
        const index = getRandomInt(WORD_LIST.length)
        words.push(WORD_LIST[index])
    }

    return words.join(sep)
}

function getRandomInt(max: number): number {
    return getRandomByte() % max
}

function getRandomByte(): number {
    return crypto.getRandomValues(new Uint8Array(1))[0]
}
