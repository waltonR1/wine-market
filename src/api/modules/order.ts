import { request } from '@/utils/request'
import { API_PATHS } from '@/config/api'
import type { OrderItem, PayOrderParams, GetOrderDetailData, PayOrderData, OrderConfirmItem } from '@/types/model/order'
import type {
  GetConfirmOrderListResponse,
  GetOrderListResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  CancelOrderResponse,
  ConfirmReceiveOrderResponse,
  GetOrderDetailResponse,
  PayOrderResponse,
} from '@/types/api/order'

export function getConfirmOrderList(): Promise<GetConfirmOrderListResponse> {
  return request<OrderConfirmItem[]>({
    url: API_PATHS.ORDER.CONFIRM_LIST,
    method: 'GET',
  })
}

export function getOrderList(): Promise<GetOrderListResponse> {
  return request<OrderItem[]>({
    url: API_PATHS.ORDER.LIST,
    method: 'GET',
  })
}

export function createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
  return request<OrderItem>({
    url: API_PATHS.ORDER.SUBMIT,
    method: 'POST',
    data,
  })
}

export function cancelOrder(id: string | number): Promise<CancelOrderResponse> {
  return request<null>({
    url: API_PATHS.ORDER.CANCEL(id),
    method: 'POST',
  })
}

export function confirmReceiveOrder(id: string | number): Promise<ConfirmReceiveOrderResponse> {
  return request<null>({
    url: API_PATHS.ORDER.CONFIRM(id),
    method: 'POST',
  })
}

/**
 * 获取订单详情
 */
export function getOrderDetail(id: string): Promise<GetOrderDetailResponse> {
  return request<GetOrderDetailData>({
    url: API_PATHS.ORDER.DETAIL(id),
    method: 'GET',
  })
}

/**
 * 支付订单
 */
export function payOrder(data: PayOrderParams): Promise<PayOrderResponse> {
  return request<PayOrderData>({
    url: API_PATHS.ORDER.PAY,
    method: 'POST',
    data,
  })
}
