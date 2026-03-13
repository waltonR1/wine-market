export function setStorage<T>(key: string, value: T) {
    uni.setStorageSync(key, value)
}

export function getStorage<T>(key: string): T | null {
    const value = uni.getStorageSync(key)
    return value || null
}

export function removeStorage(key: string) {
    uni.removeStorageSync(key)
}

export function clearStorage() {
    uni.clearStorageSync()
}