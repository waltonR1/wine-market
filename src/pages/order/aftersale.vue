<template>
  <view class="min-h-screen bg-background pb-[120px]">
    <view v-if="pageLoading" class="p-4 text-[14px] text-text-secondary">加载中...</view>

    <template v-else-if="orderDetail">
      <view class="mx-3 mt-3 rounded-2xl bg-card p-4">
        <view class="text-[16px] font-semibold text-text-main">退款/售后</view>
        <view class="mt-2 text-[12px] text-text-muted">订单号：{{ orderDetail.orderNum }}</view>
      </view>

      <view class="mx-3 mt-3 rounded-2xl bg-card p-4">
        <view class="mb-3 text-[15px] font-semibold text-text-main">售后商品</view>
        <view
          v-for="item in orderDetail.goods"
          :key="item.id"
          class="flex border-b border-divider py-3 last:border-b-0"
        >
          <image :src="item.image" class="h-[72px] w-[72px] rounded-xl bg-surface-soft" mode="aspectFill" />
          <view class="ml-3 flex-1">
            <view class="text-[14px] font-medium text-text-main">{{ item.name }}</view>
            <view v-if="item.spec" class="mt-1 text-[12px] text-text-muted">{{ item.spec }}</view>
            <view class="mt-2 flex items-center justify-between text-[12px] text-text-muted">
              <text>￥{{ item.price }}</text>
              <text>x{{ item.count }}</text>
            </view>
          </view>
        </view>
      </view>

      <view v-if="hasAfterSaleRecord" class="mx-3 mt-3 rounded-2xl bg-card p-4">
        <view class="flex items-center justify-between">
          <view class="text-[15px] font-semibold text-text-main">售后进度</view>
          <view class="rounded-full bg-surface-warm px-3 py-1 text-[12px] text-status-shipping">
            {{ afterSaleStatusText }}
          </view>
        </view>

        <view class="mt-4 rounded-2xl bg-surface-muted p-3 text-[13px] leading-6 text-text-secondary">
          <view v-if="orderDetail.afterSaleType">售后类型：{{ orderDetail.afterSaleType }}</view>
          <view v-if="orderDetail.afterSaleApplyTime">申请时间：{{ orderDetail.afterSaleApplyTime }}</view>
          <view v-if="orderDetail.afterSaleReason">申请原因：{{ orderDetail.afterSaleReason }}</view>
          <view v-if="orderDetail.afterSaleRejectReason">拒绝原因：{{ orderDetail.afterSaleRejectReason }}</view>
        </view>

        <view class="mt-4">
          <view class="mb-3 text-[14px] font-semibold text-text-main">详细时间线</view>
          <view
            v-for="(item, index) in timeline"
            :key="item.key"
            class="relative flex gap-3 pb-5 last:pb-0"
          >
            <view class="relative flex w-[18px] justify-center">
              <view
                class="z-10 mt-1 h-[10px] w-[10px] rounded-full"
                :class="item.status === 'pending' ? 'bg-divider' : item.status === 'current' ? 'bg-status-pending' : 'bg-status-shipping'"
              />
              <view
                v-if="index !== timeline.length - 1"
                class="absolute top-[16px] h-[calc(100%-4px)] w-[1px]"
                :class="item.status === 'pending' ? 'bg-divider' : 'bg-border'"
              />
            </view>
            <view class="flex-1">
              <view class="flex items-center justify-between">
                <text class="text-[14px] font-medium text-text-main">{{ item.title }}</text>
                <text class="text-[12px] text-text-muted">{{ item.time || '-' }}</text>
              </view>
              <view class="mt-1 text-[12px] leading-5 text-text-secondary">{{ item.description }}</view>
            </view>
          </view>
        </view>

        <view
          v-if="isAfterSaleFinalized"
          class="mt-4 rounded-2xl border border-border bg-surface-warm px-4 py-3 text-[12px] leading-6 text-text-secondary"
        >
          {{ finalStatusText }}
        </view>
      </view>

      <view v-else class="mx-3 mt-3 rounded-2xl bg-card p-4">
        <view class="text-[15px] font-semibold text-text-main">申请信息</view>
        <view class="mt-4 flex flex-wrap gap-2">
          <view
            v-for="item in typeOptions"
            :key="item"
            class="rounded-full px-4 py-1.5 text-[13px]"
            :class="afterSaleType === item ? 'bg-status-pending text-text-inverse' : 'bg-surface-soft text-text-secondary'"
            @click="afterSaleType = item"
          >
            {{ item }}
          </view>
        </view>
        <textarea
          v-model="reason"
          class="mt-4 h-[140px] w-full rounded-2xl bg-surface-soft p-3 text-[14px] text-text-main"
          maxlength="200"
          placeholder="请说明退款/售后原因，后续可继续扩展凭证上传、退款去向等流程。"
        />
        <view class="mt-2 text-right text-[12px] text-text-muted">{{ reason.length }}/200</view>
      </view>
    </template>

    <view v-else class="p-4 text-[14px] text-text-secondary">订单不存在</view>

    <view class="fixed bottom-0 left-0 right-0 border-t border-divider bg-card px-4 py-3">
      <view class="flex gap-3">
        <button
          v-if="hasAfterSaleRecord && canAdvanceAfterSale"
          class="h-[42px] flex-1 rounded-full border border-border bg-card text-[14px] leading-[42px] text-status-shipping"
          :disabled="actionLoading"
          :loading="actionLoading"
          @click="handleAdvance"
        >
          模拟推进进度
        </button>
        <button
          class="h-[42px] flex-1 rounded-full bg-status-pending text-[14px] leading-[42px] text-text-inverse"
          :disabled="!orderDetail || actionLoading || hasAfterSaleRecord"
          :loading="actionLoading"
          @click="submitAfterSale"
        >
          {{ hasAfterSaleRecord ? '售后申请已提交' : '提交申请' }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useOrder } from '@/hooks/useOrder'
import { getAfterSaleStatusText } from '@/utils/order'

const orderId = ref('')
const afterSaleType = ref('退款')
const reason = ref('')
const typeOptions = ['退款', '退货退款', '售后处理']
const {
  pageLoading,
  actionLoading,
  orderDetail,
  fetchOrderDetail,
  applyAfterSale,
  advanceAfterSale,
} = useOrder()

const hasAfterSaleRecord = computed(() => {
  return Boolean(orderDetail.value?.afterSaleStatus && orderDetail.value.afterSaleStatus !== 'none')
})

const canAdvanceAfterSale = computed(() => {
  const status = orderDetail.value?.afterSaleStatus
  return ['applying', 'reviewing', 'approved', 'refunding'].includes(status || '')
})

const isAfterSaleFinalized = computed(() => {
  const status = orderDetail.value?.afterSaleStatus
  return status === 'completed' || status === 'rejected'
})

const afterSaleStatusText = computed(() => getAfterSaleStatusText(orderDetail.value?.afterSaleStatus))
const timeline = computed(() => orderDetail.value?.afterSaleTimeline || [])
const finalStatusText = computed(() => {
  if (!orderDetail.value) return ''
  if (orderDetail.value.afterSaleStatus === 'completed') {
    return orderDetail.value.afterSaleCompleteTime
      ? `售后已完成，完成时间：${orderDetail.value.afterSaleCompleteTime}`
      : '售后已完成。'
  }

  if (orderDetail.value.afterSaleStatus === 'rejected') {
    return orderDetail.value.afterSaleRejectReason
      ? `售后申请未通过，原因：${orderDetail.value.afterSaleRejectReason}`
      : '售后申请未通过。'
  }

  return ''
})

async function init() {
  if (!orderId.value) return
  await fetchOrderDetail(orderId.value)
}

async function submitAfterSale() {
  if (!orderDetail.value || actionLoading.value || hasAfterSaleRecord.value) return

  if (!reason.value.trim()) {
    uni.showToast({ title: '请填写售后原因', icon: 'none' })
    return
  }

  const ok = await applyAfterSale({
    id: String(orderDetail.value.id),
    type: afterSaleType.value,
    reason: reason.value.trim(),
  })

  if (!ok) return

  uni.showToast({ title: '售后申请已提交', icon: 'success' })
  init()
}

async function handleAdvance() {
  if (!orderDetail.value || actionLoading.value || !canAdvanceAfterSale.value) return

  const ok = await advanceAfterSale(orderDetail.value.id)
  if (!ok) return

  uni.showToast({ title: '售后进度已更新', icon: 'success' })
  init()
}

onLoad((options) => {
  orderId.value = String(options?.id || '')
  init()
})
</script>


