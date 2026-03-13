import { IS_MOCK } from '@/config/env'
import { request } from '@/utils/request'
import { confirmOrderList, defaultAddress } from '@/mock/order'
import type {
    GetConfirmOrderListResponse,
    GetDefaultAddressResponse,
} from '@/types/api/order'

export function getDefaultAddress(): Promise<GetDefaultAddressResponse> {
    if (IS_MOCK) {
        return Promise.resolve({
            code: 0,
            message: 'ok',
            data: defaultAddress,
        })
    }

    return request({
        url: '/order/default-address',
        method: 'GET',
    })
}

export function getConfirmOrderList(): Promise<GetConfirmOrderListResponse> {
    if (IS_MOCK) {
        return Promise.resolve({
            code: 0,
            message: 'ok',
            data: confirmOrderList,
        })
    }

    return request({
        url: '/order/confirm-list',
        method: 'GET',
    })
}