import { request } from '@/utils/request'
import { API_PATHS } from '@/config/api'
import type { GetMemberProfileResponse, GetWalletResponse } from '@/types/api/member'

export function getMemberProfile(): Promise<GetMemberProfileResponse> {
    return request({
        url: API_PATHS.MEMBER_PROFILE,
        method: 'GET',
    })
}

export function getWalletInfo(): Promise<GetWalletResponse> {
    return request({
        url: API_PATHS.MEMBER_WALLET,
        method: 'GET',
    })
}

export function getCoupons(): Promise<any> {
    return request({
        url: API_PATHS.MEMBER_COUPONS,
        method: 'GET',
    })
}

export function getPointsHistory(): Promise<any> {
    return request({
        url: API_PATHS.MEMBER_POINTS_HISTORY,
        method: 'GET',
    })
}

export function getFavorites(): Promise<any> {
    return request({
        url: API_PATHS.MEMBER_FAVORITES,
        method: 'GET',
    })
}

export function getFootprints(): Promise<any> {
    return request({
        url: API_PATHS.MEMBER_FOOTPRINTS,
        method: 'GET',
    })
}

export function getRealnameInfo(): Promise<any> {
    return request({
        url: API_PATHS.MEMBER_REALNAME,
        method: 'GET',
    })
}

export function getInvoices(): Promise<any> {
    return request({
        url: API_PATHS.MEMBER_INVOICES,
        method: 'GET',
    })
}
