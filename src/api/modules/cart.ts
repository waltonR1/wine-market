import { request } from '@/utils/request'
import { API_PATHS } from '@/config/api'
import type {
  GetCartListResponse,
  AddCartItemRequest,
  AddCartItemResponse,
  UpdateCartItemCountRequest,
  UpdateCartItemCountResponse,
  DeleteCartItemResponse,
  ClearCartResponse, CartServerItem,
} from '@/types/api/cart'

/**
 * 获取购物车列表
 */
export function getCartList(): Promise<GetCartListResponse> {
  return request<CartServerItem[]>({
    url: API_PATHS.CART.LIST,
    method: 'GET',
  })
}

/**
 * 添加商品到购物车
 */
export function addCartItem(data: AddCartItemRequest): Promise<AddCartItemResponse> {
  return request<CartServerItem[]>({
    url: API_PATHS.CART.ADD,
    method: 'POST',
    data,
  })
}

/**
 * 更新购物车商品数量
 */
export function updateCartItemCount(data: UpdateCartItemCountRequest): Promise<UpdateCartItemCountResponse> {
  return request<CartServerItem[]>({
    url: API_PATHS.CART.ITEM(data.id),
    method: 'POST',
    data: { count: data.count },
  })
}

/**
 * 删除单个购物车商品
 */
export function deleteCartItem(id: number): Promise<DeleteCartItemResponse> {
  return request<CartServerItem[]>({
    url: API_PATHS.CART.ITEM(id),
    method: 'DELETE',
  })
}

/**
 * 清空购物车
 */
export function clearCart(): Promise<ClearCartResponse> {
  return request<null>({
    url: API_PATHS.CART.CLEAR,
    method: 'DELETE',
  })
}
