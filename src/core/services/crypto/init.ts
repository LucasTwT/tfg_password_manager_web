import sodium from "libsodium-wrappers"

let initialized = false

export async function ensureSodiumReady(): Promise<typeof sodium> {
    if (!initialized) {
        await sodium.ready
        initialized = true
    }
    return sodium
}
