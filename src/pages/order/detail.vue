<template>
  <view class="min-h-screen bg-background pb-[120px]">
    <template v-if="pageLoading">
      <view class="p-4 text-[14px] text-text-secondary">加载中...</view>
    </template>

    <template v-else-if="orderDetail">
      <view class="bg-accent px-4 py-5 text-white">
        <view class="text-[20px] font-bold">{{ orderDetail.statusLabel }}</view>
        <view class="mt-2 text-[13px] opacity-90">{{ getOrderStatusDesc(orderDetail.status) }}</view>
        <view
          v-if="statusExtraText"
          class="mt-3 rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-[12px] leading-5"
        >
          {{ statusExtraText }}
        </view>
      </view>

      <view class="mx-3 -mt-3 rounded-2xl bg-white p-4 shadow-sm">
        <view class="text-[15px] font-bold text-text-main">
          {{ orderDetail.address.name }} {{ orderDetail.address.phone }}
        </view>
        <view class="mt-2 text-[13px] leading-5 text-text-secondary">
          {{ orderDetail.address.province }} {{ orderDetail.address.city }} {{ orderDetail.address.district }} {{ orderDetail.address.detail }}
        </view>
      </view>

      <view class="mx-3 mt-3 rounded-2xl bg-white p-4">
        <view class="mb-3 text-[15px] font-bold text-text-main">商品信息</view>
        <view
          v-for="item in orderDetail.goods"
          :key="item.id"
          class="flex border-b border-[#F5F5F5] py-3 last:border-b-0"
        >
          <image :src="item.image" class="h-[88px] w-[88px] rounded-xl bg-[#F7F7F7]" mode="aspectFill" />
          <view class="ml-3 flex-1">
            <view class="line-clamp-2 text-[14px] font-medium text-text-main">
              {{ item.name }}
            </view>
            <view v-if="item.spec" class="mt-1 text-[12px] text-text-secondary">
              {{ item.spec }}
            </view>
            <view class="mt-3 flex items-center justify-between">
              <view class="text-[15px] font-bold text-accent">￥{{ item.price }}</view>
              <view class="text-[12px] text-text-secondary">x{{ item.count }}</view>
            </view>
          </view>
        </view>
      </view>

      <view class="mx-3 mt-3 rounded-2xl bg-white p-4">
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
            <text class="text-text-secondary">取消时间</text>
            <text class="text-text-main">{{ formatOrderTime(orderDetail.cancelTime) }}</text>
          </view>
          <view v-if="orderDetail.remark" class="flex justify-between">
            <text class="text-text-secondary">订单备注</text>
            <text class="ml-4 flex-1 text-right text-text-main">{{ orderDetail.remark }}</text>
          </view>
        </view>
      </view>

      <view class="mx-3 mt-3 rounded-2xl bg-white p-4">
        <view class="mb-3 text-[15px] font-bold text-text-main">金额明细</view>
        <view class="space-y-3 text-[13px]">
          <view class="flex justify-between">
            <text class="text-text-secondary">商品总额</text>
            <text class="text-text-main">￥{{ orderDetail.totalPrice }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-text-secondary">运费</text>
            <text class="text-text-main">￥{{ orderDetail.freight }}</text>
          </view>
          <view class="flex justify-between text-[15px] font-bold">
            <text class="text-text-main">实付款</text>
            <text class="text-accent">￥{{ orderDetail.payPrice }}</text>
          </view>
        </view>
      </view>

      <view class="mx-3 mt-3 rounded-2xl bg-white p-4">
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
      v-if="orderDetail"
      class="fixed bottom-0 left-0 right-0 flex items-center justify-end gap-3 border-t border-[#F3F3F3] bg-white px-4 py-3"
    >
      <button
        v-if="canCancelOrder(orderDetail.status)"
        class="h-[38px] rounded-full border border-[#DDDDDD] bg-white px-4 text-[13px] leading-[38px] text-text-main"
        :loading="actionLoading"
        :disabled="actionLoading"
        @click="handleCancel"
      >
        取消订单
      </button>

      <button
        v-if="canPayOrder(orderDetail.status)"
        class="h-[38px] rounded-full bg-accent px-5 text-[13px] leading-[38px] text-white"
        @click="goPay"
      >
        去支付
      </button>

      <button
        v-if="canConfirmReceive(orderDetail.status)"
        class="h-[38px] rounded-full bg-accent px-5 text-[13px] leading-[38px] text-white"
        :loading="actionLoading"
        :disabled="actionLoading"
        @click="handleConfirmReceive"
      >
        确认收货
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { useOrder } from '@/hooks/useOrder'
import { formatDateTime } from '@/utils/format'
import {
  getOrderStatusDesc,
  getOrderPayTypeText,
  canCancelOrder,
  canPayOrder,
  canConfirmReceive,
} from '@/utils/order'

const orderId = ref('')
const { pageLoading, actionLoading, orderDetail, fetchOrderDetail, cancelOrder, confirmReceiveOrder } = useOrder()

function formatOrderTime(time?: string) {
  if (!time) return '-'
  return formatDateTime(time) || time
}

const statusExtraText = computed(() => {
  if (!orderDetail.value) return ''

  if (orderDetail.value.status === 6) {
    return orderDetail.value.cancelTime
      ? `取消时间：${formatOrderTime(orderDetail.value.cancelTime)}`
      : '订单已取消'
  }

  if (orderDetail.value.status === 4) {
    return orderDetail.value.finishTime
      ? `完成时间：${formatOrderTime(orderDetail.value.finishTime)}`
      : '订单已完成'
  }

  if (orderDetail.value.status === 3) {
    return orderDetail.value.logisticsStatusText || '商品已发货，请留意物流动态'
  }

  return ''
})

async function init() {
  if (!orderId.value) return
  await fetchOrderDetail(orderId.value)
}

async function handleCancel() {
  if (!orderDetail.value || actionLoading.value) return

  const confirmed = await new Promise<boolean>((resolve) => {
    uni.showModal({
      title: '提示',
      content: '确定取消该订单吗？',
      success: (res) => resolve(res.confirm),
      fail: () => resolve(false),
    })
  })

  if (!confirmed) return

  const success = await cancelOrder(orderDetail.value.id)
  if (!success) return

  uni.showToast({
    title: '订单已取消',
    icon: 'success',
  })
}

async function handleConfirmReceive() {
  if (!orderDetail.value || actionLoading.value) return

  const success = await confirmReceiveOrder(orderDetail.value.id)
  if (!success) return

  uni.showToast({
    title: '已确认收货',
    icon: 'success',
  })
}

function goPay() {
  if (!orderDetail.value) return
  uni.navigateTo({
    url: `/pages/order/pay?id=${orderDetail.value.id}`,
  })
}

onLoad((options) => {
  orderId.value = String(options?.id || '')
  init()
})
</script>
