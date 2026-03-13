import type { ApiResponse } from '@/types/common'
import type { AddressInfo, OrderConfirmItem } from '@/types/model/order'

export type GetDefaultAddressResponse = ApiResponse<AddressInfo>

export type GetConfirmOrderListResponse = ApiResponse<OrderConfirmItem[]>