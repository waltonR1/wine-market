import APP_CONFIG, {
  canAccessOrderDebugPage,
  canShowOrderDebugEntry,
  canUseRiskyOrderDebugFeatures,
} from '@/config/app'
import { getAfterSaleStatusText, getOrderActions, getOrderStatusDescByOrder, getOrderStatusText } from '@/utils/order'
import type {
  OrderDebugCapabilityMap,
  OrderDebugPresetItem,
  OrderDebugPresetKey,
  OrderDebugStatusNode,
  OrderDebugSummary,
  OrderDebugTimelineFieldMeta,
  OrderTimelineField,
} from '@/types/model/order-debug'
import type { OrderDetail, OrderStatus } from '@/types/model/order'

export const ORDER_DEBUG_TIMELINE_FIELDS: OrderDebugTimelineFieldMeta[] = [
  { key: 'createTime', label: '下单时间', description: '订单创建时间' },
  { key: 'payTime', label: '支付时间', description: '支付成功时间' },
  { key: 'deliveryTime', label: '发货时间', description: '商家发货时间' },
  { key: 'finishTime', label: '完成时间', description: '确认收货或订单完成时间' },
  { key: 'cancelTime', label: '关闭时间', description: '订单关闭时间' },
  { key: 'refundTime', label: '退款时间', description: '退款完成或到账时间' },
  { key: 'afterSaleApplyTime', label: '售后申请时间', description: '售后发起时间' },
  { key: 'afterSaleHandleTime', label: '售后处理时间', description: '平台处理售后时间' },
  { key: 'afterSaleCompleteTime', label: '售后完成时间', description: '售后流程结束时间' },
]

const ORDER_DEBUG_PRESET_MAP: Record<OrderDebugPresetKey, OrderDebugPresetItem> = {
  pendingPay: {
    key: 'pendingPay',
    title: '待付款',
    description: '回到刚下单未支付状态',
  },
  paidPendingShip: {
    key: 'paidPendingShip',
    title: '待发货',
    description: '补齐支付时间，进入待发货',
  },
  shippedPendingReceive: {
    key: 'shippedPendingReceive',
    title: '待收货',
    description: '补齐支付与发货信息，进入物流阶段',
  },
  completedPendingComment: {
    key: 'completedPendingComment',
    title: '待评价',
    description: '补齐完成时间，进入待评价',
  },
  closedCancelled: {
    key: 'closedCancelled',
    title: '已关闭',
    description: '按取消关闭场景补齐关闭字段',
  },
  refundProcessing: {
    key: 'refundProcessing',
    title: '退款处理中',
    description: '进入退款处理中阶段',
  },
  refundCompleted: {
    key: 'refundCompleted',
    title: '退款完成',
    description: '进入退款完成阶段',
  },
  afterSaleProcessing: {
    key: 'afterSaleProcessing',
    title: '售后处理中',
    description: '进入售后审核或处理中阶段',
  },
  afterSaleCompleted: {
    key: 'afterSaleCompleted',
    title: '售后完成',
    description: '进入售后结束状态',
  },
}

export function getOrderDebugCapabilities(): OrderDebugCapabilityMap {
  return {
    canOpen: canAccessOrderDebugPage(),
    canEditStatus: APP_CONFIG.ORDER_FEATURES.ALLOW_EDIT_ORDER_STATUS,
    canEditTimeline: APP_CONFIG.ORDER_FEATURES.ALLOW_EDIT_ORDER_TIMELINE,
    canSimulatePayment: APP_CONFIG.ORDER_FEATURES.ALLOW_SIMULATE_PAYMENT,
    canSimulateDelivery: APP_CONFIG.ORDER_FEATURES.ALLOW_SIMULATE_DELIVERY,
    canSimulateLogistics: APP_CONFIG.ORDER_FEATURES.ALLOW_SIMULATE_LOGISTICS_UPDATE,
    canSimulateReceive: APP_CONFIG.ORDER_FEATURES.ALLOW_SIMULATE_RECEIVE,
    canSimulateComplete: APP_CONFIG.ORDER_FEATURES.ALLOW_SIMULATE_COMPLETE,
    canSimulateCancel: APP_CONFIG.ORDER_FEATURES.ALLOW_SIMULATE_CANCEL,
    canSimulateAfterSale: APP_CONFIG.ORDER_FEATURES.ALLOW_SIMULATE_AFTER_SALE,
    canReset: APP_CONFIG.ORDER_FEATURES.ALLOW_RESET_ORDER_TO_INITIAL,
    canDelete: APP_CONFIG.ORDER_FEATURES.ALLOW_DELETE_DEBUG_ORDER,
    canJump: APP_CONFIG.ORDER_FEATURES.ALLOW_DIRECT_STATUS_JUMP,
    canIgnoreTimelineOrder: APP_CONFIG.ORDER_TIMELINE_RULES.ALLOW_IGNORE_TIMELINE_ORDER,
    canViewLogs: APP_CONFIG.ORDER_FEATURES.ALLOW_VIEW_DEBUG_LOGS,
    canViewRawJson: APP_CONFIG.ORDER_DEBUG_UI.SHOW_RAW_ORDER_JSON,
    canViewStateMachine: APP_CONFIG.ORDER_DEBUG_UI.SHOW_STATE_MACHINE,
  }
}

export function getOrderDebugAvailableTransitions(status: OrderStatus): OrderStatus[] {
  // 配置层保留 as const，调试层统一返回可安全消费的数组副本。
  return [...(APP_CONFIG.ORDER_FEATURES.allowedTransitions[status] || [])]
}

export function getOrderDebugPresetList(): OrderDebugPresetItem[] {
  if (!APP_CONFIG.ORDER_DEBUG_PRESETS.ENABLE_PRESETS) return []

  return APP_CONFIG.ORDER_DEBUG_PRESETS.PRESET_LIST.map(item => {
    const preset = ORDER_DEBUG_PRESET_MAP[item.key as OrderDebugPresetKey]
    return preset || {
      key: item.key as OrderDebugPresetKey,
      title: item.title,
      description: '',
    }
  })
}

export function getOrderDebugStateMachine(): OrderDebugStatusNode[] {
  return ([1, 2, 3, 4, 6] as OrderStatus[]).map(status => ({
    status,
    label: getOrderStatusText(status),
    description: getOrderStatusDescByOrder({
      status,
      cancelTime: '',
      commentTime: '',
      closeReason: status === 6 ? 'cancelled' : undefined,
      afterSaleStatus: 'none',
      appendCommentTime: '',
    }),
  }))
}

export function shouldShowOrderDebugEntry() {
  return canShowOrderDebugEntry()
}

export function shouldShowRiskyDebugZone() {
  const capabilities = getOrderDebugCapabilities()
  return (
    APP_CONFIG.ORDER_DEBUG_UI.SHOW_DANGER_ZONE &&
    (canUseRiskyOrderDebugFeatures() ||
      capabilities.canReset ||
      capabilities.canDelete ||
      capabilities.canJump ||
      capabilities.canIgnoreTimelineOrder)
  )
}

export function getOrderDebugSummary(order: OrderDetail): OrderDebugSummary {
  return {
    statusText: getOrderStatusText(order.status),
    statusDescription: getOrderStatusDescByOrder(order),
    afterSaleText:
      order.afterSaleStatus && order.afterSaleStatus !== 'none'
        ? getAfterSaleStatusText(order.afterSaleStatus)
        : '无售后',
    actionList: getOrderActions(order),
  }
}

function parseTime(value?: string) {
  if (!value) return null
  const normalized = value.replace('T', ' ').replace(/-/g, '/')
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) return null
  return date.getTime()
}

export function validateOrderTimeline(
  patch: Partial<Record<OrderTimelineField, string>>,
  ignoreOrder = false
) {
  if (ignoreOrder) {
    return { valid: true, message: '' }
  }

  const orderedFields = ORDER_DEBUG_TIMELINE_FIELDS.map(item => item.key)
  let previousTime: number | null = null
  let previousLabel = ''

  for (const field of orderedFields) {
    const value = patch[field]
    const currentTime = parseTime(value)
    if (currentTime == null) continue

    if (previousTime != null && currentTime < previousTime) {
      const currentLabel = ORDER_DEBUG_TIMELINE_FIELDS.find(item => item.key === field)?.label || field
      return {
        valid: false,
        message: `${currentLabel}不能早于${previousLabel}`,
      }
    }

    previousTime = currentTime
    previousLabel = ORDER_DEBUG_TIMELINE_FIELDS.find(item => item.key === field)?.label || field
  }

  return { valid: true, message: '' }
}
