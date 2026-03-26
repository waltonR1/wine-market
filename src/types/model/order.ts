import type { AddressInfo } from './address'

export type OrderStatus = 1 | 2 | 3 | 4 | 6
export type OrderCloseReason = 'cancelled' | 'commented'
export type CommentMode = 'initial' | 'append'
export type AfterSaleStatus =
  | 'none'
  | 'applying'
  | 'reviewing'
  | 'approved'
  | 'refunding'
  | 'completed'
  | 'rejected'

export type OrderAction =
  | 'cancel'
  | 'pay'
  | 'confirm'
  | 'comment'
  | 'delete'
  | 'rebuy'
  | 'aftersale'

export interface OrderGoodsItem {
  id: number
  name: string
  image: string
  price: number
  count: number
  spec?: string
  stock?: number
}

export interface AfterSaleTimelineItem {
  key: string
  title: string
  description: string
  time?: string
  status: 'finished' | 'current' | 'pending'
}

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
  cancelTime?: string
  commentTime?: string
  closeReason?: OrderCloseReason
  commentScore?: number
  commentContent?: string
  commentAnonymous?: boolean
  commentImages?: string[]
  appendCommentTime?: string
  appendCommentContent?: string
  appendCommentImages?: string[]
  afterSaleStatus?: AfterSaleStatus
  afterSaleType?: string
  afterSaleReason?: string
  afterSaleApplyTime?: string
  afterSaleHandleTime?: string
  afterSaleCompleteTime?: string
  afterSaleRejectReason?: string
  afterSaleTimeline?: AfterSaleTimelineItem[]
}

export interface OrderDetail extends OrderItem {
  payTime?: string
  deliveryTime?: string
  finishTime?: string
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

export interface GetOrderDetailData {
  order: OrderDetail
}

export interface PayOrderParams {
  id: string
  payType?: string
}

export interface PayOrderData {
  id: string
  status: OrderStatus
  statusLabel: string
  payTime?: string
}

export interface UpdateOrderStatusData {
  id: string
  status: OrderStatus
  statusLabel: string
  cancelTime?: string
  finishTime?: string
  commentTime?: string
  closeReason?: OrderCloseReason
  commentScore?: number
  commentContent?: string
  commentAnonymous?: boolean
  commentImages?: string[]
  appendCommentTime?: string
  appendCommentContent?: string
  appendCommentImages?: string[]
  afterSaleStatus?: AfterSaleStatus
  afterSaleType?: string
  afterSaleReason?: string
  afterSaleApplyTime?: string
  afterSaleHandleTime?: string
  afterSaleCompleteTime?: string
  afterSaleRejectReason?: string
  afterSaleTimeline?: AfterSaleTimelineItem[]
}

export interface CancelOrderParams {
  id: string
}

export interface ConfirmReceiveParams {
  id: string
}

export interface DeleteOrderParams {
  id: string
}

export interface RebuyOrderParams {
  id: string
}

export interface RebuyOrderData {
  id: string
  affectedIds: number[]
}

export interface CommentOrderParams {
  id: string
  score: number
  content: string
  anonymous?: boolean
  images?: string[]
  mode?: CommentMode
}

export interface ApplyAfterSaleParams {
  id: string
  type: string
  reason: string
}

export interface AdvanceAfterSaleParams {
  id: string
}
