import type { OrderStatus } from '@/types/model/order'

type OrderAction = 'cancel' | 'pay' | 'confirm' | 'comment'

interface OrderStatusConfigItem {
  text: string
  desc: string
  actions: OrderAction[]
}

const PAY_TYPE_TEXT_MAP: Record<string, string> = {
  wechat: '微信支付',
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, OrderStatusConfigItem> = {
  1: {
    text: '待付款',
    desc: '请尽快完成支付',
    actions: ['cancel', 'pay'],
  },
  2: {
    text: '待发货',
    desc: '商家正在备货中',
    actions: [],
  },
  3: {
    text: '待收货',
    desc: '商品已发出，请注意查收',
    actions: ['confirm'],
  },
  4: {
    text: '待评价',
    desc: '订单已完成，欢迎再次购买',
    actions: ['comment'],
  },
  6: {
    text: '已取消',
    desc: '订单已取消',
    actions: [],
  },
}

export function getOrderStatusText(status: OrderStatus) {
  return ORDER_STATUS_CONFIG[status].text
}

export function getOrderStatusDesc(status: OrderStatus) {
  return ORDER_STATUS_CONFIG[status].desc
}

export function getOrderPayTypeText(payType?: string) {
  if (!payType) return '-'
  return PAY_TYPE_TEXT_MAP[payType] || payType
}

export function hasOrderAction(status: OrderStatus, action: OrderAction) {
  return ORDER_STATUS_CONFIG[status].actions.includes(action)
}

export function canCancelOrder(status: OrderStatus) {
  return hasOrderAction(status, 'cancel')
}

export function canPayOrder(status: OrderStatus) {
  return hasOrderAction(status, 'pay')
}

export function canConfirmReceive(status: OrderStatus) {
  return hasOrderAction(status, 'confirm')
}

export function canCommentOrder(status: OrderStatus) {
  return hasOrderAction(status, 'comment')
}
