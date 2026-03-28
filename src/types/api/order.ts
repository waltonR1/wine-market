import type { ApiResponse } from '@/types/common'
import type { AddressInfo } from '@/types/model/address'
import type {
  AdvanceAfterSaleParams,
  ApplyAfterSaleParams,
  CommentOrderParams,
  GetOrderDetailData,
  OrderConfirmItem,
  OrderItem,
  PayOrderData,
  PayOrderParams,
  RebuyOrderData,
  RebuyOrderParams,
  UpdateOrderStatusData,
} from '@/types/model/order'
import type {
  OrderDebugActionPayload,
  OrderDebugActionResult,
  OrderDebugInfo,
} from '@/types/model/order-debug'

export type GetConfirmOrderListResponse = ApiResponse<OrderConfirmItem[]>

export type GetOrderListResponse = ApiResponse<OrderItem[]>

export interface CreateOrderRequest {
  goods: OrderConfirmItem[]
  address: AddressInfo
  remark?: string
  from?: 'cart' | 'buyNow'
}

export type CreateOrderResponse = ApiResponse<OrderItem>

export type CancelOrderResponse = ApiResponse<UpdateOrderStatusData>

export type ConfirmReceiveOrderResponse = ApiResponse<UpdateOrderStatusData>

export type DeleteOrderResponse = ApiResponse<null>

export type GetOrderDetailResponse = ApiResponse<GetOrderDetailData>

export interface PayOrderRequest extends PayOrderParams {}

export type PayOrderResponse = ApiResponse<PayOrderData>

export interface RebuyOrderRequest extends RebuyOrderParams {}

export type RebuyOrderResponse = ApiResponse<RebuyOrderData>

export interface CommentOrderRequest extends CommentOrderParams {}

export type CommentOrderResponse = ApiResponse<UpdateOrderStatusData>

export interface ApplyAfterSaleRequest extends ApplyAfterSaleParams {}

export type ApplyAfterSaleResponse = ApiResponse<UpdateOrderStatusData>

export interface AdvanceAfterSaleRequest extends AdvanceAfterSaleParams {}

export type AdvanceAfterSaleResponse = ApiResponse<UpdateOrderStatusData>

export interface GetOrderDebugInfoRequest {
  id: string
}

export type GetOrderDebugInfoResponse = ApiResponse<OrderDebugInfo>

export interface OrderDebugActionRequest extends Omit<OrderDebugActionPayload, 'id'> {}

export type OrderDebugActionResponse = ApiResponse<OrderDebugActionResult>
