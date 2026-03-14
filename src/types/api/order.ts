import type { ApiResponse } from '@/types/common'
import type { AddressInfo, OrderConfirmItem, OrderItem } from '@/types/model/order'

export type GetDefaultAddressResponse = ApiResponse<AddressInfo>

export type GetAddressListResponse = ApiResponse<AddressInfo[]>

export type GetConfirmOrderListResponse = ApiResponse<OrderConfirmItem[]>

export type GetOrderListResponse = ApiResponse<OrderItem[]>