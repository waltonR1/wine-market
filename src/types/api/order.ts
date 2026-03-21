import type { ApiResponse } from '@/types/common'
import type { OrderConfirmItem, OrderItem } from '@/types/model/order'

export type GetConfirmOrderListResponse = ApiResponse<OrderConfirmItem[]>

export type GetOrderListResponse = ApiResponse<OrderItem[]>
