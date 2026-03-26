import type { ApiResponse } from '@/types/common'
import type {
  OrderConfirmItem,
  OrderItem,
  GetOrderDetailData,
  PayOrderData,
  PayOrderParams,
  DeleteOrderParams,
  RebuyOrderParams,
  UpdateOrderStatusData,
  RebuyOrderData,
  CommentOrderParams,
  ApplyAfterSaleParams,
} from '@/types/model/order'
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

export type CancelOrderResponse = ApiResponse<UpdateOrderStatusData>

export type ConfirmReceiveOrderResponse = ApiResponse<UpdateOrderStatusData>

export interface DeleteOrderRequest extends DeleteOrderParams {}

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
