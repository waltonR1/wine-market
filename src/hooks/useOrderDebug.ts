import { computed, ref } from 'vue'
import { canAccessOrderDebugPage } from '@/config/app'
import { useOrder } from '@/hooks/useOrder'
import {
  getOrderDebugAvailableTransitions,
  getOrderDebugCapabilities,
  getOrderDebugPresetList,
  getOrderDebugStateMachine,
  getOrderDebugSummary,
  ORDER_DEBUG_TIMELINE_FIELDS,
  shouldShowRiskyDebugZone,
  validateOrderTimeline,
} from '@/utils/orderDebug'
import type { OrderStatus } from '@/types/model/order'
import type {
  OrderDebugActionPayload,
  OrderDebugInfo,
  OrderDebugLogItem,
  OrderDebugPresetKey,
  OrderTimelineField,
} from '@/types/model/order-debug'

function createTimelineForm() {
  return {
    createTime: '',
    payTime: '',
    deliveryTime: '',
    finishTime: '',
    cancelTime: '',
    refundTime: '',
    afterSaleApplyTime: '',
    afterSaleHandleTime: '',
    afterSaleCompleteTime: '',
  } satisfies Record<OrderTimelineField, string>
}

function createLogisticsForm() {
  return {
    company: '',
    no: '',
    statusText: '',
    trackTitle: '',
    trackDescription: '',
    trackTime: '',
  }
}

function formatLogTime(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function useOrderDebug() {
  const { pageLoading, actionLoading, orderDetail, fetchOrderDebugInfo, runOrderDebugAction } = useOrder()

  const blockedReason = ref('')
  const snapshotReady = ref(false)
  const logs = ref<OrderDebugLogItem[]>([])
  const ignoreTimelineOrder = ref(false)
  const showDangerZone = ref(false)
  const timelineForm = ref(createTimelineForm())
  const logisticsForm = ref(createLogisticsForm())

  const capabilities = computed(() => getOrderDebugCapabilities())
  const availableTransitions = computed(() =>
    orderDetail.value ? getOrderDebugAvailableTransitions(orderDetail.value.status) : []
  )
  const presetList = computed(() => getOrderDebugPresetList())
  const debugSummary = computed(() => (orderDetail.value ? getOrderDebugSummary(orderDetail.value) : null))
  const rawOrderText = computed(() => (orderDetail.value ? JSON.stringify(orderDetail.value, null, 2) : ''))
  const stateMachine = computed(() => getOrderDebugStateMachine())
  const shouldShowDangerZone = computed(() => shouldShowRiskyDebugZone())

  function syncFormState(debugInfo: OrderDebugInfo) {
    snapshotReady.value = debugInfo.snapshotReady
    timelineForm.value = {
      createTime: debugInfo.order.createTime || '',
      payTime: debugInfo.order.payTime || '',
      deliveryTime: debugInfo.order.deliveryTime || '',
      finishTime: debugInfo.order.finishTime || '',
      cancelTime: debugInfo.order.cancelTime || '',
      refundTime: debugInfo.order.refundTime || '',
      afterSaleApplyTime: debugInfo.order.afterSaleApplyTime || '',
      afterSaleHandleTime: debugInfo.order.afterSaleHandleTime || '',
      afterSaleCompleteTime: debugInfo.order.afterSaleCompleteTime || '',
    }
    logisticsForm.value = {
      company: debugInfo.order.logisticsCompany || '',
      no: debugInfo.order.logisticsNo || '',
      statusText: debugInfo.order.logisticsStatusText || '',
      trackTitle: '',
      trackDescription: '',
      trackTime: '',
    }
  }

  function appendLog(label: string, success: boolean, detail = '') {
    logs.value.unshift({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      time: formatLogTime(),
      label,
      result: success ? 'success' : 'error',
      detail,
    })
  }

  async function init(orderId: string) {
    blockedReason.value = ''

    if (!canAccessOrderDebugPage()) {
      blockedReason.value = '当前环境或业务开关未开启订单调试能力'
      return false
    }

    const data = await fetchOrderDebugInfo(orderId)
    if (!data) {
      blockedReason.value = '订单调试信息加载失败'
      return false
    }

    syncFormState(data)
    return true
  }

  async function performAction(payload: OrderDebugActionPayload, label: string) {
    const result = await runOrderDebugAction(payload)
    if (!result) {
      appendLog(label, false, '接口返回失败')
      return null
    }

    if (result.order) {
      syncFormState({
        order: result.order,
        snapshotReady: snapshotReady.value || Boolean(result.order),
        availableTransitions: result.availableTransitions,
        stateMachine: getOrderDebugStateMachine(),
      })
    }

    appendLog(label, true, result.message || '操作成功')
    return result
  }

  async function saveTimeline() {
    if (!orderDetail.value) return null

    const validation = validateOrderTimeline(
      timelineForm.value,
      ignoreTimelineOrder.value && capabilities.value.canIgnoreTimelineOrder
    )
    if (!validation.valid) {
      uni.showToast({ title: validation.message, icon: 'none' })
      appendLog('保存时间线', false, validation.message)
      return null
    }

    return performAction(
      {
        id: orderDetail.value.id,
        action: 'updateTimeline',
        timelinePatch: timelineForm.value,
        ignoreTimelineOrder: ignoreTimelineOrder.value && capabilities.value.canIgnoreTimelineOrder,
      },
      '保存时间线'
    )
  }

  async function updateLogistics() {
    if (!orderDetail.value) return null

    return performAction(
      {
        id: orderDetail.value.id,
        action: 'updateLogistics',
        logistics: {
          company: logisticsForm.value.company,
          no: logisticsForm.value.no,
          statusText: logisticsForm.value.statusText,
          trackTitle: logisticsForm.value.trackTitle,
          trackDescription: logisticsForm.value.trackDescription,
          trackTime: logisticsForm.value.trackTime,
        },
      },
      '更新物流信息'
    )
  }

  async function applyPreset(presetKey: string) {
    if (!orderDetail.value) return null
    return performAction(
      {
        id: orderDetail.value.id,
        action: 'applyPreset',
        presetKey: presetKey as OrderDebugPresetKey,
      },
      `应用预设：${presetKey}`
    )
  }

  async function transitionTo(status: OrderStatus) {
    if (!orderDetail.value) return null
    return performAction(
      {
        id: orderDetail.value.id,
        action: 'transition',
        targetStatus: status,
      },
      `推进到状态 ${status}`
    )
  }

  async function jumpTo(status: OrderStatus) {
    if (!orderDetail.value) return null
    return performAction(
      {
        id: orderDetail.value.id,
        action: 'jump',
        targetStatus: status,
      },
      `直接跳转到状态 ${status}`
    )
  }

  return {
    pageLoading,
    actionLoading,
    orderDetail,
    blockedReason,
    snapshotReady,
    logs,
    ignoreTimelineOrder,
    showDangerZone,
    shouldShowDangerZone,
    timelineForm,
    logisticsForm,
    capabilities,
    availableTransitions,
    presetList,
    debugSummary,
    rawOrderText,
    stateMachine,
    timelineFields: ORDER_DEBUG_TIMELINE_FIELDS,
    init,
    performAction,
    saveTimeline,
    updateLogistics,
    applyPreset,
    transitionTo,
    jumpTo,
  }
}
