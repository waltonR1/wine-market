import { request } from '@/utils/request'
import { API_PATHS } from '@/config/api'
import type {
  ApplyAfterSaleParams,
  CommentOrderParams,
  GetOrderDetailData,
  OrderConfirmItem,
  OrderItem,
  PayOrderData,
  PayOrderParams,
  RebuyOrderData,
  UpdateOrderStatusData,
} from '@/types/model/order'
import type {
  OrderDebugActionPayload,
  OrderDebugActionResult,
  OrderDebugInfo,
} from '@/types/model/order-debug'
import type {
  AdvanceAfterSaleResponse,
  ApplyAfterSaleResponse,
  CommentOrderResponse,
  ConfirmReceiveOrderResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  DeleteOrderResponse,
  GetConfirmOrderListResponse,
  GetOrderDebugInfoResponse,
  GetOrderDetailResponse,
  GetOrderListResponse,
  OrderDebugActionResponse,
  PayOrderResponse,
  RebuyOrderResponse,
  CancelOrderResponse,
} from '@/types/api/order'

export function getConfirmOrderList(): Promise<GetConfirmOrderListResponse> {
  return request<OrderConfirmItem[]>({
    url: API_PATHS.ORDER.CONFIRM_LIST,
    method: 'GET',
  })
}

export function getOrderList(): Promise<GetOrderListResponse> {
  return request<OrderItem[]>({
    url: API_PATHS.ORDER.LIST,
    method: 'GET',
  })
}

export function createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
  return request<OrderItem>({
    url: API_PATHS.ORDER.SUBMIT,
    method: 'POST',
    data,
  })
}

export function cancelOrder(id: string | number): Promise<CancelOrderResponse> {
  return request<UpdateOrderStatusData>({
    url: API_PATHS.ORDER.CANCEL(id),
    method: 'POST',
  })
}

export function confirmReceiveOrder(id: string | number): Promise<ConfirmReceiveOrderResponse> {
  return request<UpdateOrderStatusData>({
    url: API_PATHS.ORDER.CONFIRM(id),
    method: 'POST',
  })
}

export function deleteOrder(id: string | number): Promise<DeleteOrderResponse> {
  return request<null>({
    url: API_PATHS.ORDER.DELETE(id),
    method: 'DELETE',
  })
}

export function getOrderDetail(id: string): Promise<GetOrderDetailResponse> {
  return request<GetOrderDetailData>({
    url: API_PATHS.ORDER.DETAIL(id),
    method: 'GET',
  })
}

export function payOrder(data: PayOrderParams): Promise<PayOrderResponse> {
  return request<PayOrderData>({
    url: API_PATHS.ORDER.PAY,
    method: 'POST',
    data,
  })
}

export function rebuyOrder(id: string | number): Promise<RebuyOrderResponse> {
  return request<RebuyOrderData>({
    url: API_PATHS.ORDER.REBUY(id),
    method: 'POST',
  })
}

export function commentOrder(data: CommentOrderParams): Promise<CommentOrderResponse> {
  return request<UpdateOrderStatusData>({
    url: API_PATHS.ORDER.COMMENT(data.id),
    method: 'POST',
    data,
  })
}

export function applyAfterSale(data: ApplyAfterSaleParams): Promise<ApplyAfterSaleResponse> {
  return request<UpdateOrderStatusData>({
    url: API_PATHS.ORDER.AFTER_SALE(data.id),
    method: 'POST',
    data,
  })
}

export function advanceAfterSale(id: string | number): Promise<AdvanceAfterSaleResponse> {
  return request<UpdateOrderStatusData>({
    url: API_PATHS.ORDER.AFTER_SALE_ADVANCE(id),
    method: 'POST',
  })
}

export function getOrderDebugInfo(id: string | number): Promise<GetOrderDebugInfoResponse> {
  return request<OrderDebugInfo>({
    url: API_PATHS.ORDER.DEBUG_INFO(id),
    method: 'GET',
  })
}

export function debugOrderAction(payload: OrderDebugActionPayload): Promise<OrderDebugActionResponse> {
  return request<OrderDebugActionResult>({
    url: API_PATHS.ORDER.DEBUG_ACTION(payload.id),
    method: 'POST',
    data: payload,
  })
}
