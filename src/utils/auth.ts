import { TOKEN_KEY } from '@/constants'
import { getStorage, removeStorage, setStorage } from '@/utils/storage'

export function getToken(): string {
    return getStorage<string>(TOKEN_KEY) || ''
}

export function setToken(token: string) {
    setStorage(TOKEN_KEY, token)
}

export function removeToken() {
    removeStorage(TOKEN_KEY)
}

export function hasToken(): boolean {
    return !!getToken()
}