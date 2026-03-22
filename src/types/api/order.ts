import type { ApiResponse } from '@/types/common'
import type { OrderConfirmItem, OrderItem } from '@/types/model/order'
import type { AddressInfo } from '@/types/model/address'

export type GetConfirmOrderListResponse = ApiResponse<OrderConfirmItem[]>

export type GetOrderListResponse = ApiResponse<OrderItem[]>

export interface CreateOrderRequest {
  goods: OrderConfirmItem[]
  address: AddressInfo
  remark?: string
  from?: 'cart' | 'buyNow'
}

export type CreateOrderResponse = ApiResponse<OrderItem>

export type CancelOrderResponse = ApiResponse<null>

export type ConfirmReceiveOrderResponse = ApiResponse<null>
