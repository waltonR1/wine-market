<template>
  <view class="min-h-screen bg-background pb-8">
    <view class="bg-hero px-4 py-5 text-text-inverse">
      <view class="flex items-center justify-between">
        <view>
          <view class="text-[20px] font-bold">订单调试</view>
          <view class="mt-1 text-[12px] opacity-90">仅用于开发/测试，所有调试写回真实订单字段</view>
        </view>
        <view class="rounded-full border border-overlay-strong bg-overlay-light px-3 py-1 text-[11px]">
          开发工具
        </view>
      </view>

      <view v-if="orderDetail" class="mt-4 rounded-2xl border border-overlay-border bg-overlay-light p-3 text-[12px]">
        <view>订单号：{{ orderDetail.orderNum }}</view>
        <view class="mt-1">当前状态：{{ debugSummary?.statusText }} / {{ orderDetail.status }}</view>
        <view class="mt-1">状态说明：{{ debugSummary?.statusDescription }}</view>
      </view>
    </view>

    <view class="space-y-3 px-3 py-3">
      <view v-if="blockedReason" class="rounded-2xl border border-debug-danger bg-danger-soft p-4 text-[13px] text-debug-danger">
        {{ blockedReason }}
      </view>

      <view v-else-if="pageLoading" class="rounded-2xl bg-card p-4 text-[14px] text-text-secondary">
        调试信息加载中...
      </view>

      <template v-else-if="orderDetail">
        <DebugSection title="当前概览" desc="这里展示订单当前的业务状态、售后状态和常规用户动作。">
          <view class="grid grid-cols-2 gap-3 text-[13px]">
            <view class="rounded-2xl bg-surface-muted p-3">
              <view class="text-text-secondary">订单状态</view>
              <view class="mt-1 font-semibold text-text-main">{{ debugSummary?.statusText }}</view>
            </view>
            <view class="rounded-2xl bg-surface-muted p-3">
              <view class="text-text-secondary">售后状态</view>
              <view class="mt-1 font-semibold text-text-main">{{ debugSummary?.afterSaleText }}</view>
            </view>
          </view>
          <view v-if="debugSummary?.actionList.length" class="mt-4">
            <view class="mb-2 text-[12px] text-text-secondary">当前用户侧可执行动作</view>
            <view class="flex flex-wrap gap-2">
              <view
                v-for="action in debugSummary?.actionList"
                :key="action.type"
                class="rounded-full border border-divider bg-card px-3 py-1 text-[12px] text-text-main"
              >
                {{ action.text }}
              </view>
            </view>
          </view>
        </DebugSection>

        <DebugSection title="预设场景" desc="一键切到典型生命周期场景，用于联调列表、详情、评价、售后入口。">
          <DebugActionGrid
            :actions="presetActions"
            @action="handlePresetAction"
          />
        </DebugSection>

        <DebugSection title="生命周期操作" desc="严格按 allowedTransitions 推进状态，不会绕开当前订单状态机。">
          <DebugActionGrid
            :actions="transitionActions"
            @action="handleTransitionAction"
          />
        </DebugSection>

        <DebugSection title="支付调试" desc="用于推进支付结果或模拟支付关闭，不改正式支付接口语义。">
          <DebugActionGrid
            :actions="paymentActions"
            @action="handleQuickAction"
          />
        </DebugSection>

        <DebugSection title="发货与物流" desc="发货动作会直接写回发货时间、物流公司、运单号和物流状态。">
          <DebugActionGrid
            :actions="deliveryActions"
            @action="handleQuickAction"
          />
          <view class="mt-4 space-y-3">
            <input v-model="logisticsForm.company" class="rounded-2xl bg-surface-muted px-3 py-3 text-[13px]" placeholder="物流公司" />
            <input v-model="logisticsForm.no" class="rounded-2xl bg-surface-muted px-3 py-3 text-[13px]" placeholder="物流单号" />
            <input v-model="logisticsForm.statusText" class="rounded-2xl bg-surface-muted px-3 py-3 text-[13px]" placeholder="物流状态文案" />
            <input v-model="logisticsForm.trackTitle" class="rounded-2xl bg-surface-muted px-3 py-3 text-[13px]" placeholder="轨迹标题（可选）" />
            <input v-model="logisticsForm.trackDescription" class="rounded-2xl bg-surface-muted px-3 py-3 text-[13px]" placeholder="轨迹说明（可选）" />
            <input v-model="logisticsForm.trackTime" class="rounded-2xl bg-surface-muted px-3 py-3 text-[13px]" placeholder="轨迹时间，格式 2026-03-28 18:30" />
            <view class="rounded-2xl bg-cta px-4 py-3 text-center text-[13px] text-text-inverse" @click="handleSaveLogistics">
              保存物流调试信息
            </view>
          </view>
        </DebugSection>

        <DebugSection title="时间线调试" desc="时间线直接写回订单真实字段，默认启用先后顺序校验。">
          <view class="space-y-3">
            <view v-for="field in timelineFields" :key="field.key">
              <view class="mb-1 text-[12px] text-text-secondary">{{ field.label }}</view>
              <input
                v-model="timelineForm[field.key]"
                class="rounded-2xl bg-surface-muted px-3 py-3 text-[13px]"
                :placeholder="`${field.description}，格式 2026-03-28 18:30`"
              />
            </view>
            <view
              v-if="capabilities.canIgnoreTimelineOrder"
              class="flex items-center justify-between rounded-2xl bg-surface-warm px-3 py-3 text-[12px]"
              @click="ignoreTimelineOrder = !ignoreTimelineOrder"
            >
              <text class="text-text-main">忽略时间顺序约束</text>
              <text :class="ignoreTimelineOrder ? 'text-debug-warning' : 'text-text-muted'">
                {{ ignoreTimelineOrder ? '已开启' : '未开启' }}
              </text>
            </view>
            <view class="rounded-2xl bg-cta px-4 py-3 text-center text-[13px] text-text-inverse" @click="handleSaveTimeline">
              保存时间线
            </view>
          </view>
        </DebugSection>

        <DebugSection title="取消 / 关闭调试" desc="用于模拟用户取消、系统取消和超时关闭，会补齐关闭时间和关闭原因。">
          <DebugActionGrid
            :actions="cancelActions"
            @action="handleQuickAction"
          />
        </DebugSection>

        <DebugSection title="售后 / 退款调试" desc="售后调试基于现有 afterSale 字段与时间线字段，不单独造影子状态。">
          <DebugActionGrid
            :actions="afterSaleActions"
            @action="handleQuickAction"
          />
        </DebugSection>

        <DebugSection
          v-if="shouldShowDangerZone"
          title="高风险操作"
          desc="这些操作可能绕开正常状态机，仅在高风险调试开关开启时使用。"
          danger
        >
          <template #extra>
            <view class="text-[12px] text-status-refunding" @click="showDangerZone = !showDangerZone">
              {{ showDangerZone ? '收起' : '展开' }}
            </view>
          </template>
          <view v-if="showDangerZone" class="space-y-4">
            <DebugActionGrid
              :actions="dangerActions"
              @action="handleDangerAction"
            />
            <view v-if="capabilities.canJump">
              <view class="mb-2 text-[12px] text-status-refunding">直接跳状态</view>
              <view class="grid grid-cols-3 gap-3">
                <view
                  v-for="node in stateMachine"
                  :key="node.status"
                  class="rounded-2xl border border-debug-danger px-3 py-3 text-center text-[12px] text-debug-danger"
                  @click="handleJump(node.status)"
                >
                  {{ node.label }}
                </view>
              </view>
            </view>
          </view>
        </DebugSection>

        <DebugSection title="能力开关" desc="便于确认当前环境层与业务层到底放开了哪些调试能力。">
          <view class="space-y-2 text-[12px]">
            <view v-for="cap in capabilityEntries" :key="cap.key" class="flex items-center justify-between rounded-xl bg-surface-muted px-3 py-2">
              <text class="text-text-secondary">{{ cap.label }}</text>
              <text :class="cap.value ? 'text-success' : 'text-text-muted'">{{ cap.value ? '开启' : '关闭' }}</text>
            </view>
          </view>
        </DebugSection>

        <DebugSection v-if="capabilities.canViewStateMachine" title="状态机信息" desc="展示当前状态体系和当前状态允许推进的下一步。">
          <view class="space-y-2 text-[12px]">
            <view
              v-for="node in stateMachine"
              :key="node.status"
              class="rounded-2xl bg-surface-muted px-3 py-3"
            >
              <view class="font-medium text-text-main">{{ node.label }} / {{ node.status }}</view>
              <view class="mt-1 text-text-secondary">{{ node.description }}</view>
            </view>
          </view>
        </DebugSection>

        <DebugSection v-if="capabilities.canViewRawJson" title="原始订单数据" desc="用于核对调试写回是否已经落到真实业务字段。">
          <view class="overflow-hidden rounded-2xl bg-surface-muted p-3">
            <text selectable="false" class="text-[11px] leading-5 text-text-secondary">{{ rawOrderText }}</text>
          </view>
        </DebugSection>

        <DebugSection v-if="capabilities.canViewLogs" title="调试日志" desc="仅记录当前页面会话内的调试操作历史。">
          <view v-if="logs.length" class="space-y-2">
            <view
              v-for="log in logs"
              :key="log.id"
              class="rounded-2xl px-3 py-3 text-[12px]"
              :class="log.result === 'success' ? 'bg-surface-muted text-text-main' : 'bg-danger-soft text-debug-danger'"
            >
              <view class="flex items-center justify-between">
                <text>{{ log.label }}</text>
                <text class="text-text-muted">{{ log.time }}</text>
              </view>
              <view v-if="log.detail" class="mt-1 leading-5">{{ log.detail }}</view>
            </view>
          </view>
          <view v-else class="rounded-2xl bg-surface-muted px-3 py-4 text-[12px] text-text-muted">
            当前页面还没有调试操作记录
          </view>
        </DebugSection>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import DebugActionGrid from '@/components/order-debug/DebugActionGrid.vue'
import DebugSection from '@/components/order-debug/DebugSection.vue'
import { useOrderDebug } from '@/hooks/useOrderDebug'
import type { OrderDebugActionType } from '@/types/model/order-debug'
import type { OrderStatus } from '@/types/model/order'

const orderId = ref('')
const {
  pageLoading,
  actionLoading,
  orderDetail,
  blockedReason,
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
  timelineFields,
  init,
  performAction,
  saveTimeline,
  updateLogistics,
  applyPreset,
  transitionTo,
  jumpTo,
} = useOrderDebug()

const capabilityEntries = computed(() => [
  { key: 'open', label: '可访问调试页', value: capabilities.value.canOpen },
  { key: 'status', label: '允许编辑状态', value: capabilities.value.canEditStatus },
  { key: 'timeline', label: '允许编辑时间线', value: capabilities.value.canEditTimeline },
  { key: 'payment', label: '允许模拟支付', value: capabilities.value.canSimulatePayment },
  { key: 'delivery', label: '允许模拟发货', value: capabilities.value.canSimulateDelivery },
  { key: 'logistics', label: '允许模拟物流更新', value: capabilities.value.canSimulateLogistics },
  { key: 'receive', label: '允许模拟收货', value: capabilities.value.canSimulateReceive },
  { key: 'aftersale', label: '允许模拟售后', value: capabilities.value.canSimulateAfterSale },
  { key: 'reset', label: '允许重置初始状态', value: capabilities.value.canReset },
  { key: 'delete', label: '允许删除订单', value: capabilities.value.canDelete },
  { key: 'jump', label: '允许直接跳状态', value: capabilities.value.canJump },
  { key: 'raw', label: '允许查看原始 JSON', value: capabilities.value.canViewRawJson },
])

const presetActions = computed(() =>
  presetList.value.map(item => ({
    key: item.key,
    label: item.title,
    desc: item.description,
    tone: 'secondary' as const,
    loading: actionLoading.value,
  }))
)

const transitionActions = computed(() =>
  availableTransitions.value.map(status => ({
    key: String(status),
    label: `推进到 ${stateMachine.value.find(node => node.status === status)?.label || status}`,
    desc: '按 allowedTransitions 执行',
    tone: 'primary' as const,
    loading: actionLoading.value,
  }))
)

const paymentActions = computed(() => [
  {
    key: 'simulatePaySuccess',
    label: '模拟支付成功',
    desc: '写回支付时间并进入待发货',
    tone: 'primary' as const,
    disabled: !capabilities.value.canSimulatePayment,
    loading: actionLoading.value,
  },
  {
    key: 'simulatePayFailure',
    label: '模拟支付失败',
    desc: '保持当前状态，仅验证失败提示链路',
    tone: 'warning' as const,
    disabled: !capabilities.value.canSimulatePayment,
    loading: actionLoading.value,
  },
  {
    key: 'simulatePayClose',
    label: '模拟支付关闭',
    desc: '按超时关闭订单',
    tone: 'warning' as const,
    disabled: !capabilities.value.canSimulatePayment,
    loading: actionLoading.value,
  },
])

const deliveryActions = computed(() => [
  {
    key: 'simulateDelivery',
    label: '模拟发货',
    desc: '写回发货时间与物流字段',
    tone: 'primary' as const,
    disabled: !capabilities.value.canSimulateDelivery,
    loading: actionLoading.value,
  },
  {
    key: 'simulateReceive',
    label: '模拟签收/收货',
    desc: '写回完成时间并进入待评价',
    tone: 'primary' as const,
    disabled: !capabilities.value.canSimulateReceive,
    loading: actionLoading.value,
  },
  {
    key: 'simulateComplete',
    label: '模拟订单完成',
    desc: '补齐评价前置状态',
    tone: 'secondary' as const,
    disabled: !capabilities.value.canSimulateComplete,
    loading: actionLoading.value,
  },
])

const cancelActions = computed(() => [
  {
    key: 'cancelByUser',
    label: '模拟用户取消',
    desc: '关闭原因写为用户取消',
    tone: 'warning' as const,
    disabled: !capabilities.value.canSimulateCancel,
    loading: actionLoading.value,
  },
  {
    key: 'cancelBySystem',
    label: '模拟系统取消',
    desc: '关闭原因写为系统关闭',
    tone: 'warning' as const,
    disabled: !capabilities.value.canSimulateCancel,
    loading: actionLoading.value,
  },
  {
    key: 'cancelByTimeout',
    label: '模拟超时关闭',
    desc: '关闭原因写为支付超时',
    tone: 'warning' as const,
    disabled: !capabilities.value.canSimulateCancel,
    loading: actionLoading.value,
  },
])

const afterSaleActions = computed(() => [
  {
    key: 'startRefund',
    label: '发起退款/售后',
    desc: '进入售后申请中',
    tone: 'secondary' as const,
    disabled: !capabilities.value.canSimulateAfterSale,
    loading: actionLoading.value,
  },
  {
    key: 'refundProcessing',
    label: '退款处理中',
    desc: '进入退款处理中',
    tone: 'secondary' as const,
    disabled: !capabilities.value.canSimulateAfterSale,
    loading: actionLoading.value,
  },
  {
    key: 'refundSuccess',
    label: '退款成功',
    desc: '补齐退款完成时间',
    tone: 'primary' as const,
    disabled: !capabilities.value.canSimulateAfterSale,
    loading: actionLoading.value,
  },
  {
    key: 'refundFailure',
    label: '退款失败',
    desc: '进入售后驳回态',
    tone: 'warning' as const,
    disabled: !capabilities.value.canSimulateAfterSale,
    loading: actionLoading.value,
  },
  {
    key: 'afterSaleProcessing',
    label: '售后处理中',
    desc: '进入平台审核/处理中',
    tone: 'secondary' as const,
    disabled: !capabilities.value.canSimulateAfterSale,
    loading: actionLoading.value,
  },
  {
    key: 'afterSaleComplete',
    label: '售后完成',
    desc: '结束售后流程',
    tone: 'primary' as const,
    disabled: !capabilities.value.canSimulateAfterSale,
    loading: actionLoading.value,
  },
])

const dangerActions = computed(() => [
  {
    key: 'reset',
    label: '重置到初始快照',
    desc: '恢复首次建立快照时的订单数据',
    tone: 'danger' as const,
    disabled: !capabilities.value.canReset,
    loading: actionLoading.value,
  },
  {
    key: 'delete',
    label: '删除调试订单',
    desc: '直接删除当前订单记录',
    tone: 'danger' as const,
    disabled: !capabilities.value.canDelete,
    loading: actionLoading.value,
  },
])

async function handlePresetAction(key: string) {
  await applyPreset(key)
}

async function handleTransitionAction(key: string) {
  await transitionTo(Number(key) as OrderStatus)
}

async function handleQuickAction(key: string) {
  if (!orderDetail.value) return
  await performAction(
    {
      id: orderDetail.value.id,
      action: key as OrderDebugActionType,
    },
    `执行动作：${key}`
  )
}

async function handleDangerAction(key: string) {
  if (!orderDetail.value) return
  const confirmed = await new Promise<boolean>(resolve => {
    uni.showModal({
      title: '高风险操作确认',
      content: '该操作可能绕开正常状态机，是否继续？',
      success: res => resolve(res.confirm),
      fail: () => resolve(false),
    })
  })

  if (!confirmed) return

  const result = await performAction(
    {
      id: orderDetail.value.id,
      action: key as OrderDebugActionType,
    },
    `执行危险动作：${key}`
  )

  if (result?.deleted) {
    uni.redirectTo({ url: '/pages/order/list' })
  }
}

async function handleJump(status: OrderStatus) {
  await jumpTo(status)
}

async function handleSaveTimeline() {
  await saveTimeline()
}

async function handleSaveLogistics() {
  await updateLogistics()
}

onLoad(async options => {
  orderId.value = String(options?.id || '')
  if (!orderId.value) {
    uni.showToast({ title: '缺少订单 ID', icon: 'none' })
    return
  }
  await init(orderId.value)
})
</script>
