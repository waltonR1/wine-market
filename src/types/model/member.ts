export interface MemberProfile {
    nickname: string
    welcomeText: string
    favoriteCount: number
    pendingPayCount: number
    pendingShipCount: number
    pendingReceiveCount: number
    pendingRateCount: number
    returnCount: number
    points: number
}

export interface WalletInfo {
    balance: number
    points: number
    couponCount: number
}