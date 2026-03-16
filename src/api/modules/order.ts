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

export function getOrderList(): Promise<GetOrderListResponse> {
    return request<OrderItem[]>({
        url: API_PATHS.ORDER_LIST,
        method: 'GET',
    })
}
