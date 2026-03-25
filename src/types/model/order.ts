import type { AddressInfo } from './address'

export type OrderStatus = 1 | 2 | 3 | 4 | 6

export interface OrderGoodsItem {
  id: number
  name: string
  image: string
  price: number
  count: number
  spec?: string
}

/**
 * 订单列表项
 */
export interface OrderItem {
  id: string
  orderNum: string
  status: OrderStatus
  statusLabel: string
  createTime: string
  totalPrice: number
  totalCount: number
  freight: number
  payPrice: number
  goods: OrderGoodsItem[]
  address: AddressInfo
  remark?: string
}

/**
 * 订单详情
 * 比列表项更完整，后续可继续扩展
 */
export interface OrderDetail extends OrderItem {
  payTime?: string
  deliveryTime?: string
  finishTime?: string
  cancelTime?: string

  payType?: string

  logisticsCompany?: string
  logisticsNo?: string
  logisticsStatusText?: string
}

export interface OrderConfirmItem {
  id: number
  name: string
  spec: string
  price: number
  count: number
  image: string
  stock: number
}

/**
 * 订单详情响应
 */
export interface GetOrderDetailData {
  order: OrderDetail
}

/**
 * 支付订单请求参数
 */
export interface PayOrderParams {
  id: string
  payType?: string
}

/**
 * 支付订单响应
 */
export interface PayOrderData {
  id: string
  status: OrderStatus
  statusLabel: string
  payTime?: string
}

/**
 * 取消订单请求参数
 */
export interface CancelOrderParams {
  id: string
}

/**
 * 确认收货请求参数
 */
export interface ConfirmReceiveParams {
  id: string
}
