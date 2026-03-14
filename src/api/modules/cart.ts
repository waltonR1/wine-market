import { request } from '@/utils/request'
import { API_PATHS } from '@/config/api'
import type { GetCartListResponse } from '@/types/api/cart'

export function getCartList(): Promise<GetCartListResponse> {
    return request({
        url: API_PATHS.CART_LIST,
        method: 'GET',
    })
}
