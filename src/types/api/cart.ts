import type { ApiResponse } from '@/types/common'
import type { CartItem } from '@/types/model/cart'

export type GetCartListResponse = ApiResponse<CartItem[]>