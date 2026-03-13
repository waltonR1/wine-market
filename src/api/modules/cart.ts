import { IS_MOCK } from '@/config/env'
import { request } from '@/utils/request'
import { cartList } from '@/mock/cart'
import type { GetCartListResponse } from '@/types/api/cart'

export function getCartList(): Promise<GetCartListResponse> {
    if (IS_MOCK) {
        return Promise.resolve({
            code: 0,
            message: 'ok',
            data: cartList,
        })
    }

    return request({
        url: '/cart',
        method: 'GET',
    })
}