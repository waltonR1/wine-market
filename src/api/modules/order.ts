import { request } from '@/utils/request'
import { API_PATHS } from '@/config/api'
import type { OrderItem } from '@/types/model/order'
import type {
  GetConfirmOrderListResponse,
  GetOrderListResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  CancelOrderResponse,
  ConfirmReceiveOrderResponse,
} from '@/types/api/order'

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

export function createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
  return request({
    url: API_PATHS.ORDER_SUBMIT,
    method: 'POST',
    data,
  })
}

export function cancelOrder(id: string | number): Promise<CancelOrderResponse> {
  return request({
    url: API_PATHS.ORDER_CANCEL(id),
    method: 'POST',
  })
}

export function confirmReceiveOrder(id: string | number): Promise<ConfirmReceiveOrderResponse> {
  return request({
    url: API_PATHS.ORDER_CONFIRM(id),
    method: 'POST',
  })
}
