import type { OrderDetail, OrderStatus } from './order'

export type OrderDebugPresetKey =
  | 'pendingPay'
  | 'paidPendingShip'
  | 'shippedPendingReceive'
  | 'completedPendingComment'
  | 'closedCancelled'
  | 'refundProcessing'
  | 'refundCompleted'
  | 'afterSaleProcessing'
  | 'afterSaleCompleted'

export type OrderTimelineField =
  | 'createTime'
  | 'payTime'
  | 'deliveryTime'
  | 'finishTime'
  | 'cancelTime'
  | 'refundTime'
  | 'afterSaleApplyTime'
  | 'afterSaleHandleTime'
  | 'afterSaleCompleteTime'

export type OrderDebugActionType =
  | 'transition'
  | 'jump'
  | 'applyPreset'
  | 'reset'
  | 'delete'
  | 'updateTimeline'
  | 'simulatePaySuccess'
  | 'simulatePayFailure'
  | 'simulatePayClose'
  | 'simulateDelivery'
  | 'updateLogistics'
  | 'simulateReceive'
  | 'simulateComplete'
  | 'cancelByUser'
  | 'cancelBySystem'
  | 'cancelByTimeout'
  | 'startRefund'
  | 'refundProcessing'
  | 'refundSuccess'
  | 'refundFailure'
  | 'afterSaleProcessing'
  | 'afterSaleComplete'

export interface OrderDebugTimelineFieldMeta {
  key: OrderTimelineField
  label: string
  description: string
}

export interface OrderDebugPresetItem {
  key: OrderDebugPresetKey
  title: string
  description: string
}

export interface OrderDebugCapabilityMap {
  canOpen: boolean
  canEditStatus: boolean
  canEditTimeline: boolean
  canSimulatePayment: boolean
  canSimulateDelivery: boolean
  canSimulateLogistics: boolean
  canSimulateReceive: boolean
  canSimulateComplete: boolean
  canSimulateCancel: boolean
  canSimulateAfterSale: boolean
  canReset: boolean
  canDelete: boolean
  canJump: boolean
  canIgnoreTimelineOrder: boolean
  canViewLogs: boolean
  canViewRawJson: boolean
  canViewStateMachine: boolean
}

export interface OrderDebugStatusNode {
  status: OrderStatus
  label: string
  description: string
}

export interface OrderDebugInfo {
  order: OrderDetail
  snapshotReady: boolean
  availableTransitions: OrderStatus[]
  stateMachine: OrderDebugStatusNode[]
}

export interface OrderDebugLogItem {
  id: string
  time: string
  label: string
  result: 'success' | 'error'
  detail?: string
}

export interface OrderDebugLogisticsPayload {
  company?: string
  no?: string
  statusText?: string
  trackTitle?: string
  trackDescription?: string
  trackTime?: string
}

export interface OrderDebugTimelinePatch extends Partial<Record<OrderTimelineField, string>> {}

export interface OrderDebugActionPayload {
  id: string
  action: OrderDebugActionType
  targetStatus?: OrderStatus
  presetKey?: OrderDebugPresetKey
  timelinePatch?: OrderDebugTimelinePatch
  ignoreTimelineOrder?: boolean
  logistics?: OrderDebugLogisticsPayload
  cancelReason?: string
  note?: string
}

export interface OrderDebugActionResult {
  action: OrderDebugActionType
  message: string
  order: OrderDetail | null
  availableTransitions: OrderStatus[]
  deleted?: boolean
}

export interface OrderDebugSummary {
  statusText: string
  statusDescription: string
  afterSaleText: string
  actionList: Array<{
    type: string
    text: string
    style: 'primary' | 'secondary' | 'rebuy' | 'danger'
    priority: number
  }>
}
