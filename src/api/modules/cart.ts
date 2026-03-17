import { request } from '@/utils/request'
import { API_PATHS } from '@/config/api'
import type {
  GetCartListResponse,
  AddCartItemRequest,
  AddCartItemResponse,
  UpdateCartItemCountRequest,
  UpdateCartItemCountResponse,
  UpdateCartItemCheckedRequest,
  UpdateCartItemCheckedResponse,
  UpdateCartAllCheckedRequest,
  UpdateCartAllCheckedResponse,
  DeleteCartItemRequest,
  DeleteCartItemResponse,
  BatchDeleteCartItemsRequest,
  BatchDeleteCartItemsResponse,
  ClearCartResponse,
  GetCartSummaryResponse,
} from '@/types/api/cart'

/**
 * 获取购物车列表
 */
export function getCartList(): Promise<GetCartListResponse> {
  return request({
    url: API_PATHS.CART_LIST,
    method: 'GET',
  })
}

/**
 * 添加商品到购物车
 */
export function addCartItem(data: AddCartItemRequest): Promise<AddCartItemResponse> {
  return request({
    url: API_PATHS.CART_ADD,
    method: 'POST',
    data,
  })
}

/**
 * 更新购物车商品数量
 */
export function updateCartItemCount(
  data: UpdateCartItemCountRequest
): Promise<UpdateCartItemCountResponse> {
  return request({
    url: API_PATHS.CART_UPDATE_COUNT,
    method: 'POST',
    data,
  })
}

/**
 * 更新单个商品选中状态
 */
export function updateCartItemChecked(
  data: UpdateCartItemCheckedRequest
): Promise<UpdateCartItemCheckedResponse> {
  return request({
    url: API_PATHS.CART_UPDATE_CHECKED,
    method: 'POST',
    data,
  })
}

/**
 * 更新全选状态
 */
export function updateCartAllChecked(
  data: UpdateCartAllCheckedRequest
): Promise<UpdateCartAllCheckedResponse> {
  return request({
    url: API_PATHS.CART_UPDATE_ALL_CHECKED,
    method: 'POST',
    data,
  })
}

/**
 * 删除单个购物车商品
 */
export function deleteCartItem(
  data: DeleteCartItemRequest
): Promise<DeleteCartItemResponse> {
  return request({
    url: API_PATHS.CART_DELETE,
    method: 'POST',
    data,
  })
}

/**
 * 批量删除购物车商品
 */
export function batchDeleteCartItems(
  data: BatchDeleteCartItemsRequest
): Promise<BatchDeleteCartItemsResponse> {
  return request({
    url: API_PATHS.CART_BATCH_DELETE,
    method: 'POST',
    data,
  })
}

/**
 * 清空购物车
 */
export function clearCart(): Promise<ClearCartResponse> {
  return request({
    url: API_PATHS.CART_CLEAR,
    method: 'POST',
  })
}

/**
 * 获取购物车摘要
 * 比如总数量、已选数量、总价等
 */
export function getCartSummary(): Promise<GetCartSummaryResponse> {
  return request({
    url: API_PATHS.CART_SUMMARY,
    method: 'GET',
  })
}
