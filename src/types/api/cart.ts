import type { ApiResponse } from '@/types/common'
import type { CartItem } from '@/types/model/cart'

export interface CartSummary {
  totalCount: number
  checkedCount: number
  totalPrice: number
  checkedIds: number[]
}

export type GetCartListResponse = ApiResponse<CartItem[]>

export interface AddCartItemRequest {
  id: number
  count: number
}

export type AddCartItemResponse = ApiResponse<CartItem[]>

export interface UpdateCartItemCountRequest {
  id: number
  count: number
}

export type UpdateCartItemCountResponse = ApiResponse<CartItem[]>

export interface UpdateCartItemCheckedRequest {
  id: number
  checked: boolean
}

export type UpdateCartItemCheckedResponse = ApiResponse<CartItem[]>

export interface UpdateCartAllCheckedRequest {
  checked: boolean
}

export type UpdateCartAllCheckedResponse = ApiResponse<CartItem[]>

export interface DeleteCartItemRequest {
  id: number
}

export type DeleteCartItemResponse = ApiResponse<CartItem[]>

export interface BatchDeleteCartItemsRequest {
  ids: number[]
}

export type BatchDeleteCartItemsResponse = ApiResponse<CartItem[]>

export type ClearCartResponse = ApiResponse<null>

export type GetCartSummaryResponse = ApiResponse<CartSummary>
