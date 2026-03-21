import type { ApiResponse } from '@/types/common'

export interface CartServerItem {
  id: number
  name: string
  price: number
  count: number
  image: string
}

export interface CartSummary {
  totalCount: number
  checkedCount: number
  totalPrice: number
  checkedIds: number[]
}

export type GetCartListResponse = ApiResponse<CartServerItem[]>

export interface AddCartItemRequest {
  id: number
  count: number
}

export type AddCartItemResponse = ApiResponse<CartServerItem[]>

export interface UpdateCartItemCountRequest {
  id: number
  count: number
}

export type UpdateCartItemCountResponse = ApiResponse<CartServerItem[]>

export type DeleteCartItemResponse = ApiResponse<CartServerItem[]>

export type ClearCartResponse = ApiResponse<null>

export type GetCartSummaryResponse = ApiResponse<CartSummary>
