<template>
  <view class="min-h-screen bg-background pb-[120px]">
    <template v-if="pageLoading">
      <view class="p-4 text-[14px] text-text-secondary">加载中...</view>
    </template>

    <template v-else-if="orderDetail">
      <view class="bg-hero px-4 py-5 text-text-inverse">
        <view class="flex items-start justify-between">
          <view class="text-[20px] font-bold">
            {{ orderDetail.statusLabel }}
          </view>

          <view
            v-if="showDebugEntry"
            class="ml-3 shrink-0 inline-flex rounded-full border border-overlay-strong bg-overlay-light px-3 py-1 text-[11px]"
            @click="goOrderDebug"
          >
            开发调试
          </view>
        </view>
        <view class="mt-2 text-[13px] opacity-90">{{ getOrderStatusDescByOrder(orderDetail) }}</view>
        <view
          v-if="statusExtraText"
          class="mt-3 rounded-xl border border-overlay-strong bg-overlay-light px-3 py-2 text-[12px] leading-5"
        >
          {{ statusExtraText }}
        </view>
      </view>

      <view class="mx-3 -mt-3 rounded-2xl bg-card p-4 shadow-sm">
        <view class="text-[15px] font-bold text-text-main">
          {{ orderDetail.address.name }} {{ orderDetail.address.phone }}
        </view>
        <view class="mt-2 text-[13px] leading-5 text-text-secondary">
          {{ orderDetail.address.province }} {{ orderDetail.address.city }} {{ orderDetail.address.district }} {{ orderDetail.address.detail }}
        </view>
      </view>

      <view class="mx-3 mt-3 rounded-2xl bg-card p-4">
        <view class="mb-3 text-[15px] font-bold text-text-main">商品信息</view>
        <view
          v-for="item in orderDetail.goods"
          :key="item.id"
          class="flex border-b border-divider py-3 last:border-b-0"
        >
          <image :src="item.image" class="h-[88px] w-[88px] rounded-xl bg-surface-soft" mode="aspectFill" />
          <view class="ml-3 flex-1">
            <view class="line-clamp-2 text-[14px] font-medium text-text-main">{{ item.name }}</view>
            <view v-if="item.spec" class="mt-1 text-[12px] text-text-secondary">{{ item.spec }}</view>
            <view class="mt-3 flex items-center justify-between">
              <view class="text-[15px] font-bold text-price">￥{{ item.price }}</view>
              <view class="text-[12px] text-text-secondary">x{{ item.count }}</view>
            </view>
          </view>
        </view>
      </view>

      <view v-if="hasCommentSection" class="mx-3 mt-3 rounded-2xl bg-card p-4">
        <view class="mb-3 flex items-center justify-between">
          <view class="text-[15px] font-bold text-text-main">评价信息</view>
          <view
            v-if="canAppendCurrentOrder"
            class="rounded-full border border-status-pending px-3 py-1 text-[12px] text-status-pending"
            @click="goAppendComment"
          >
            追加评价
          </view>
        </view>

        <view v-if="orderDetail.commentTime" class="space-y-3 text-[13px]">
          <view class="flex justify-between">
            <text class="text-text-secondary">评价时间</text>
            <text class="text-text-main">{{ formatOrderTime(orderDetail.commentTime) }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-text-secondary">评价星级</text>
            <text class="text-text-main">{{ orderDetail.commentScore ?? 0 }}/5</text>
          </view>
          <view class="flex justify-between">
            <text class="text-text-secondary">评价方式</text>
            <text class="text-text-main">{{ orderDetail.commentAnonymous ? '匿名评价' : '实名评价' }}</text>
          </view>
          <view v-if="orderDetail.commentContent">
            <view class="text-text-secondary">评价内容</view>
            <view class="mt-2 rounded-2xl bg-surface-muted p-3 leading-6 text-text-main">
              {{ orderDetail.commentContent }}
            </view>
          </view>
          <view v-if="orderDetail.commentImages?.length">
            <view class="text-text-secondary">评价图片</view>
            <view class="mt-2 flex flex-wrap gap-3">
              <image
                v-for="image in orderDetail.commentImages"
                :key="image"
                :src="image"
                class="h-[76px] w-[76px] rounded-2xl bg-surface-soft"
                mode="aspectFill"
              />
            </view>
          </view>
          <view v-else>
            <view class="text-text-secondary">评价图片</view>
            <view class="mt-2 rounded-2xl border border-dashed border-border px-3 py-4 text-[12px] text-text-muted">
              暂未上传图片
            </view>
          </view>
        </view>

        <view v-if="orderDetail.appendCommentTime" class="mt-5 border-t border-divider pt-4">
          <view class="mb-2 text-[14px] font-semibold text-text-main">追评内容</view>
          <view class="text-[12px] text-text-secondary">
            追评时间：{{ formatOrderTime(orderDetail.appendCommentTime) }}
          </view>
          <view
            v-if="orderDetail.appendCommentContent"
            class="mt-2 rounded-2xl bg-surface-muted p-3 leading-6 text-text-main"
          >
            {{ orderDetail.appendCommentContent }}
          </view>
          <view v-if="orderDetail.appendCommentImages?.length" class="mt-3 flex flex-wrap gap-3">
            <image
              v-for="image in orderDetail.appendCommentImages"
              :key="image"
              :src="image"
              class="h-[76px] w-[76px] rounded-2xl bg-surface-soft"
              mode="aspectFill"
            />
          </view>
          <view
            v-else
            class="mt-2 rounded-2xl border border-dashed border-border px-3 py-4 text-[12px] text-text-muted"
          >
            本次追评未附带图片
          </view>
        </view>
      </view>

      <view class="mx-3 mt-3 rounded-2xl bg-card p-4">
        <view class="mb-3 text-[15px] font-bold text-text-main">订单信息</view>
        <view class="space-y-3 text-[13px]">
          <view class="flex justify-between">
            <text class="text-text-secondary">订单编号</text>
            <text class="text-text-main">{{ orderDetail.orderNum }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-text-secondary">下单时间</text>
            <text class="text-text-main">{{ formatOrderTime(orderDetail.createTime) }}</text>
          </view>
          <view v-if="orderDetail.payTime" class="flex justify-between">
            <text class="text-text-secondary">支付时间</text>
            <text class="text-text-main">{{ formatOrderTime(orderDetail.payTime) }}</text>
          </view>
          <view v-if="orderDetail.payType" class="flex justify-between">
            <text class="text-text-secondary">支付方式</text>
            <text class="text-text-main">{{ getOrderPayTypeText(orderDetail.payType) }}</text>
          </view>
          <view v-if="orderDetail.deliveryTime" class="flex justify-between">
            <text class="text-text-secondary">发货时间</text>
            <text class="text-text-main">{{ formatOrderTime(orderDetail.deliveryTime) }}</text>
          </view>
          <view v-if="orderDetail.finishTime" class="flex justify-between">
            <text class="text-text-secondary">完成时间</text>
            <text class="text-text-main">{{ formatOrderTime(orderDetail.finishTime) }}</text>
          </view>
          <view v-if="orderDetail.cancelTime" class="flex justify-between">
            <text class="text-text-secondary">关闭时间</text>
            <text class="text-text-main">{{ formatOrderTime(orderDetail.cancelTime) }}</text>
          </view>
          <view v-if="orderDetail.afterSaleStatus && orderDetail.afterSaleStatus !== 'none'" class="flex justify-between">
            <text class="text-text-secondary">售后状态</text>
            <text class="text-text-main">{{ getAfterSaleStatusText(orderDetail.afterSaleStatus) }}</text>
          </view>
          <view v-if="orderDetail.remark" class="flex justify-between">
            <text class="text-text-secondary">订单备注</text>
            <text class="ml-4 flex-1 text-right text-text-main">{{ orderDetail.remark }}</text>
          </view>
        </view>
      </view>

      <view class="mx-3 mt-3 rounded-2xl bg-card p-4">
        <view class="mb-3 text-[15px] font-bold text-text-main">金额明细</view>
        <view class="space-y-3 text-[13px]">
          <view class="flex justify-between">
            <text class="text-text-secondary">商品总额</text>
            <text class="text-text-main">￥{{ orderDetail.totalPrice }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-text-secondary">运费</text>
            <text class="text-text-main">￥{{ orderDetail.freight }}</text>
          </view>
          <view class="flex justify-between text-[15px] font-bold">
            <text class="text-text-main">实付款</text>
            <text class="text-price">￥{{ orderDetail.payPrice }}</text>
          </view>
        </view>
      </view>

      <view class="mx-3 mt-3 rounded-2xl bg-card p-4">
        <view class="mb-3 text-[15px] font-bold text-text-main">物流信息</view>
        <view class="space-y-3 text-[13px]">
          <view class="flex justify-between">
            <text class="text-text-secondary">物流公司</text>
            <text class="text-text-main">{{ orderDetail.logisticsCompany || '-' }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-text-secondary">运单号</text>
            <text class="text-text-main">{{ orderDetail.logisticsNo || '-' }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-text-secondary">物流状态</text>
            <text class="text-text-main">{{ orderDetail.logisticsStatusText || '暂无物流信息' }}</text>
          </view>
        </view>
      </view>
    </template>

    <template v-else>
      <view class="p-4 text-[14px] text-text-secondary">订单不存在</view>
    </template>

    <view
      v-if="orderDetail && actionList.length > 0"
      class="fixed bottom-0 left-0 right-0 flex flex-wrap items-center justify-end gap-3 border-t border-divider bg-card px-4 py-3"
    >
      <button
        v-for="action in actionList"
        :key="action.type"
        :class="getActionClass(action.style)"
        :loading="isActionPending(action.type)"
        :disabled="isActionPending(action.type)"
        @click="handleAction(action.type)"
      >
        {{ action.text }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import {onLoad} from '@dcloudio/uni-app'
import {computed, ref} from 'vue'
import { canShowOrderDebugEntry } from '@/config/app'
import {useOrder} from '@/hooks/useOrder'
import {formatDateTime} from '@/utils/format'
import {
  canAppendComment,
  getAfterSaleStatusText,
  getOrderActions,
  getOrderPayTypeText,
  getOrderStatusDescByOrder,
} from '@/utils/order'
import type {OrderAction} from '@/types/model/order'

const orderId = ref('')
const {
  pageLoading,
  actionLoading,
  orderDetail,
  fetchOrderDetail,
  cancelOrder,
  confirmReceiveOrder,
  deleteOrder,
  rebuyOrder,
} = useOrder()

const actionList = computed(() => {
  if (!orderDetail.value) return []
  return getOrderActions(orderDetail.value)
})

const canAppendCurrentOrder = computed(() => {
  if (!orderDetail.value) return false
  return canAppendComment(orderDetail.value)
})

const hasCommentSection = computed(() => {
  if (!orderDetail.value) return false
  return Boolean(orderDetail.value.commentTime || orderDetail.value.commentContent || canAppendCurrentOrder.value)
})

const showDebugEntry = computed(() => canShowOrderDebugEntry())

const statusExtraText = computed(() => {
  if (!orderDetail.value) return ''

  if (orderDetail.value.afterSaleStatus && orderDetail.value.afterSaleStatus !== 'none') {
    const timeline = orderDetail.value.afterSaleTimeline || []
    const currentNode = timeline.find(item => item.status === 'current') || timeline[timeline.length - 1]
    return currentNode?.description || `售后状态：${getAfterSaleStatusText(orderDetail.value.afterSaleStatus)}`
  }

  if (orderDetail.value.status === 6 && orderDetail.value.commentTime) {
    return `订单已评价关闭：${formatOrderTime(orderDetail.value.commentTime)}`
  }

  if (orderDetail.value.status === 6) {
    return orderDetail.value.cancelTime
      ? `订单已关闭：${formatOrderTime(orderDetail.value.cancelTime)}`
      : '订单已关闭'
  }

  if (orderDetail.value.status === 3) {
    return orderDetail.value.logisticsStatusText || '商品已发货，请留意物流动态'
  }

  return ''
})

function formatOrderTime(time?: string) {
  if (!time) return '-'
  return formatDateTime(time) || time
}

function getActionClass(style: 'primary' | 'secondary' | 'rebuy' | 'danger') {
  switch (style) {
    case 'primary':
      return 'h-[38px] rounded-full bg-status-pending px-5 text-[13px] leading-[38px] text-text-inverse'
    case 'rebuy':
      return 'h-[38px] rounded-full border border-status-shipping bg-surface-warm px-5 text-[13px] leading-[38px] text-status-shipping'
    case 'danger':
      return 'h-[38px] rounded-full border border-danger-border bg-card px-4 text-[13px] leading-[38px] text-status-refunding'
    default:
      return 'h-[38px] rounded-full border border-divider bg-card px-4 text-[13px] leading-[38px] text-text-main'
  }
}

function isActionPending(type: OrderAction) {
  return actionLoading.value && ['cancel', 'confirm', 'delete', 'rebuy'].includes(type)
}

async function init() {
  if (!orderId.value) return
  await fetchOrderDetail(orderId.value)
}

async function showConfirmModal(content: string) {
  return await new Promise<boolean>((resolve) => {
    uni.showModal({
      title: '提示',
      content,
      success: (res) => resolve(res.confirm),
      fail: () => resolve(false),
    })
  })
}

async function handleCancel() {
  if (!orderDetail.value || actionLoading.value) return
  const confirmed = await showConfirmModal('确定取消该订单吗？')
  if (!confirmed) return

  const success = await cancelOrder(orderDetail.value.id)
  if (!success) return

  uni.showToast({ title: '订单已关闭', icon: 'success' })
  init()
}

async function handleConfirmReceive() {
  if (!orderDetail.value || actionLoading.value) return
  const confirmed = await showConfirmModal('确认已收到商品？')
  if (!confirmed) return

  const success = await confirmReceiveOrder(orderDetail.value.id)
  if (!success) return

  uni.showToast({ title: '已确认收货', icon: 'success' })
  init()
}

async function handleDelete() {
  if (!orderDetail.value || actionLoading.value) return
  const confirmed = await showConfirmModal('删除后订单记录将不再显示，是否继续？')
  if (!confirmed) return

  const success = await deleteOrder(orderDetail.value.id)
  if (!success) return

  uni.showToast({ title: '订单已删除', icon: 'success' })
  setTimeout(() => {
    uni.redirectTo({
      url: '/pages/order/list',
    })
  }, 300)
}

async function handleRebuy() {
  if (!orderDetail.value || actionLoading.value) return
  const success = await rebuyOrder(orderDetail.value.id)
  if (!success) return

  uni.showToast({ title: '已同步到购物车', icon: 'success' })
  setTimeout(() => {
    uni.switchTab({
      url: '/pages/cart/index',
    })
  }, 300)
}

function goPay() {
  if (!orderDetail.value) return
  uni.navigateTo({
    url: `/pages/order/pay?id=${orderDetail.value.id}`,
  })
}

function goComment() {
  if (!orderDetail.value) return
  uni.navigateTo({
    url: `/pages/order/comment?id=${orderDetail.value.id}`,
  })
}

function goAppendComment() {
  if (!orderDetail.value) return
  uni.navigateTo({
    url: `/pages/order/comment?id=${orderDetail.value.id}&mode=append`,
  })
}

function goAfterSale() {
  if (!orderDetail.value) return
  uni.navigateTo({
    url: `/pages/order/aftersale?id=${orderDetail.value.id}`,
  })
}

function goOrderDebug() {
  if (!orderDetail.value || !showDebugEntry.value) return
  uni.navigateTo({
    url: `/pages/order/debug?id=${orderDetail.value.id}`,
  })
}

function handleAction(type: OrderAction) {
  switch (type) {
    case 'cancel':
      handleCancel()
      break
    case 'pay':
      goPay()
      break
    case 'confirm':
      handleConfirmReceive()
      break
    case 'comment':
      goComment()
      break
    case 'delete':
      handleDelete()
      break
    case 'rebuy':
      handleRebuy()
      break
    case 'aftersale':
      goAfterSale()
      break
    default:
      break
  }
}

onLoad((options) => {
  orderId.value = String(options?.id || '')
  init()
})
</script>
