export function hexToUint8(hex: string): Uint8Array {
    if (hex.length % 2 !== 0) throw new Error("Invalid hex string")

    const array = new Uint8Array(hex.length / 2)
    for (let i = 0; i < hex.length; i += 2) {
        array[i / 2] = parseInt(hex.substring(i, i + 2), 16)
    }
    return array
}
