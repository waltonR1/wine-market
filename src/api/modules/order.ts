import { request } from '@/utils/request'
import { API_PATHS } from '@/config/api'
import type { OrderItem } from '@/types/model/order'
import type {
    GetConfirmOrderListResponse,
    GetDefaultAddressResponse,
    GetAddressListResponse,
    GetOrderListResponse,
} from '@/types/api/order'

export function getDefaultAddress(): Promise<GetDefaultAddressResponse> {
    return request({
        url: API_PATHS.ORDER_DEFAULT_ADDRESS,
        method: 'GET',
    })
}

export function getAddressList(): Promise<GetAddressListResponse> {
    return request({
        url: API_PATHS.ORDER_ADDRESS_LIST,
        method: 'GET',
    })
}

export function getConfirmOrderList(): Promise<GetConfirmOrderListResponse> {
    return request({
        url: API_PATHS.ORDER_CONFIRM_LIST,
        method: 'GET',
    })
}

export async function getOrderList(status?: number): Promise<GetOrderListResponse> {
    const res = await request<OrderItem[]>({
        url: API_PATHS.ORDER_LIST,
        method: 'GET',
    })

    // 模拟服务端根据 status 过滤
    if (res.code === 0 && status && status !== 0) {
        return {
            ...res,
            data: res.data.filter(item => item.status === status)
        }
    }

    return res
}
