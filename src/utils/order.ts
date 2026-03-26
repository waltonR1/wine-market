import type {
  AfterSaleStatus,
  OrderAction,
  OrderCloseReason,
  OrderDetail,
  OrderItem,
  OrderStatus,
} from '@/types/model/order'

export interface OrderActionConfigItem {
  type: OrderAction
  text: string
  style: 'primary' | 'secondary' | 'rebuy' | 'danger'
  priority: number
}

interface OrderStatusConfigItem {
  text: string
  desc: string
  actions: OrderAction[]
}

type OrderActionTarget = Pick<
  OrderDetail,
  'status' | 'cancelTime' | 'commentTime' | 'closeReason' | 'afterSaleStatus'
>

const PAY_TYPE_TEXT_MAP: Record<string, string> = {
  wechat: '微信支付',
}

const ORDER_ACTION_META: Record<OrderAction, Omit<OrderActionConfigItem, 'text'>> = {
  delete: {
    type: 'delete',
    style: 'danger',
    priority: 100,
  },
  pay: {
    type: 'pay',
    style: 'primary',
    priority: 90,
  },
  confirm: {
    type: 'confirm',
    style: 'primary',
    priority: 80,
  },
  comment: {
    type: 'comment',
    style: 'secondary',
    priority: 70,
  },
  aftersale: {
    type: 'aftersale',
    style: 'secondary',
    priority: 60,
  },
  rebuy: {
    type: 'rebuy',
    style: 'rebuy',
    priority: 50,
  },
  cancel: {
    type: 'cancel',
    style: 'secondary',
    priority: 40,
  },
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, OrderStatusConfigItem> = {
  1: {
    text: '待付款',
    desc: '请尽快完成支付',
    actions: ['pay', 'cancel'],
  },
  2: {
    text: '待发货',
    desc: '商家正在备货中',
    actions: ['aftersale', 'rebuy'],
  },
  3: {
    text: '待收货',
    desc: '商品已发出，请注意查收',
    actions: ['confirm', 'aftersale', 'rebuy'],
  },
  4: {
    text: '待评价',
    desc: '订单已完成，提交评价后将关闭订单',
    actions: ['comment', 'aftersale', 'rebuy'],
  },
  6: {
    text: '已关闭',
    desc: '订单已关闭',
    actions: ['delete', 'aftersale', 'rebuy'],
  },
}

function inferCloseReason(order: OrderActionTarget): OrderCloseReason | undefined {
  if (order.closeReason) return order.closeReason
  if (order.status !== 6) return undefined
  return order.commentTime ? 'commented' : 'cancelled'
}

function getAfterSaleStatus(order: OrderActionTarget): AfterSaleStatus {
  return order.afterSaleStatus || 'none'
}

export function getOrderStatusText(status: OrderStatus) {
  return ORDER_STATUS_CONFIG[status].text
}

export function getOrderStatusDesc(status: OrderStatus) {
  return ORDER_STATUS_CONFIG[status].desc
}

export function getOrderDisplayStatusLabel(order: Pick<OrderDetail, 'status' | 'statusLabel' | 'commentTime' | 'closeReason'>) {
  if (order.status === 6) {
    return '已关闭'
  }

  return order.statusLabel || getOrderStatusText(order.status)
}

export function getOrderStatusDescByOrder(order: OrderActionTarget) {
  const closeReason = inferCloseReason(order)
  const afterSaleStatus = getAfterSaleStatus(order)

  if (afterSaleStatus === 'applying') {
    return '售后申请已提交，等待平台处理'
  }

  if (order.status === 6 && closeReason === 'commented') {
    return '订单已评价并关闭'
  }

  if (order.status === 6 && closeReason === 'cancelled') {
    return '订单已取消并关闭'
  }

  return getOrderStatusDesc(order.status)
}

export function getOrderPayTypeText(payType?: string) {
  if (!payType) return '-'
  return PAY_TYPE_TEXT_MAP[payType] || payType
}

export function canDeleteOrder(order: OrderActionTarget) {
  return order.status === 6 && getAfterSaleStatus(order) !== 'applying'
}

export function canApplyAfterSale(order: OrderActionTarget) {
  const closeReason = inferCloseReason(order)
  if (getAfterSaleStatus(order) === 'applying') return true
  if (order.status === 2 || order.status === 3 || order.status === 4) return true
  return order.status === 6 && closeReason === 'commented'
}

export function canCommentOrder(order: OrderActionTarget) {
  return order.status === 4
}

export function canRebuyOrder(order: OrderActionTarget) {
  return order.status !== 1
}

function canCancelOrder(order: OrderActionTarget) {
  return order.status === 1
}

function canPayOrder(order: OrderActionTarget) {
  return order.status === 1
}

function canConfirmReceive(order: OrderActionTarget) {
  return order.status === 3
}

function isActionEnabled(order: OrderActionTarget, action: OrderAction) {
  switch (action) {
    case 'delete':
      return canDeleteOrder(order)
    case 'pay':
      return canPayOrder(order)
    case 'confirm':
      return canConfirmReceive(order)
    case 'comment':
      return canCommentOrder(order)
    case 'aftersale':
      return canApplyAfterSale(order)
    case 'rebuy':
      return canRebuyOrder(order)
    case 'cancel':
      return canCancelOrder(order)
    default:
      return false
  }
}

function getActionText(order: OrderActionTarget, action: OrderAction) {
  if (action === 'aftersale' && getAfterSaleStatus(order) === 'applying') {
    return '售后进度'
  }

  switch (action) {
    case 'delete':
      return '删除订单'
    case 'pay':
      return '立即支付'
    case 'confirm':
      return '确认收货'
    case 'comment':
      return '立即评价'
    case 'aftersale':
      return '退款/售后'
    case 'rebuy':
      return '再次购买'
    case 'cancel':
      return '取消订单'
    default:
      return ''
  }
}

export function getOrderActions(order: OrderActionTarget) {
  return ORDER_STATUS_CONFIG[order.status].actions
    .map((action, index) => ({ action, index }))
    .filter(item => isActionEnabled(order, item.action))
    .sort((a, b) => {
      const priorityDiff = ORDER_ACTION_META[b.action].priority - ORDER_ACTION_META[a.action].priority
      if (priorityDiff !== 0) return priorityDiff
      return a.index - b.index
    })
    .map(({ action }) => ({
      ...ORDER_ACTION_META[action],
      text: getActionText(order, action),
    }))
}

export function normalizeOrder<T extends OrderItem | OrderDetail>(order: T): T {
  return {
    ...order,
    statusLabel: getOrderDisplayStatusLabel(order),
    closeReason: inferCloseReason(order as OrderDetail),
    afterSaleStatus: order.afterSaleStatus || 'none',
  } as T
}
