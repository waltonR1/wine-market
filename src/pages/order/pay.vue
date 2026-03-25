<template>
  <view class="min-h-screen bg-background pb-10">
    <template v-if="pageLoading">
      <view class="p-4 text-[14px] text-text-secondary">加载中...</view>
    </template>

    <template v-else-if="orderDetail">
      <view class="px-4 pt-6 text-center">
        <view class="text-[14px] text-text-secondary">需支付</view>
        <view class="mt-2 text-[32px] font-bold text-accent">¥{{ orderDetail.payPrice }}</view>
      </view>

      <view class="mx-3 mt-6 rounded-2xl bg-white p-4">
        <view class="mb-3 text-[15px] font-bold text-text-main">订单信息</view>

        <view class="space-y-3 text-[13px]">
          <view class="flex justify-between">
            <text class="text-text-secondary">订单编号</text>
            <text class="text-text-main">{{ orderDetail.orderNum }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-text-secondary">下单时间</text>
            <text class="text-text-main">{{ orderDetail.createTime }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-text-secondary">商品件数</text>
            <text class="text-text-main">{{ orderDetail.totalCount }} 件</text>
          </view>
        </view>
      </view>

      <view class="mx-3 mt-3 rounded-2xl bg-white p-4">
        <view class="mb-3 text-[15px] font-bold text-text-main">支付方式</view>

        <view
          class="flex items-center justify-between rounded-xl border px-4 py-3"
          :class="payType === 'wechat' ? 'border-accent' : 'border-[#EEEEEE]'"
          @click="payType = 'wechat'"
        >
          <view class="flex items-center">
            <text class="text-[16px]">微信支付</text>
          </view>
          <view class="text-[13px] text-accent">
            {{ payType === 'wechat' ? '已选择' : '' }}
          </view>
        </view>
      </view>

      <view class="px-4 pt-8">
        <button
          class="h-[44px] rounded-full bg-accent text-[15px] leading-[44px] text-white"
          :loading="payLoading"
          @click="handlePay"
        >
          确认支付
        </button>
      </view>
    </template>

    <template v-else>
      <view class="p-4 text-[14px] text-text-secondary">订单不存在</view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useOrder } from '@/hooks/useOrder'

const orderId = ref('')
const payType = ref<'wechat'>('wechat')

const { pageLoading, payLoading, orderDetail, fetchOrderDetail, payOrder } = useOrder()

async function init() {
  if (!orderId.value) return

  const order = await fetchOrderDetail(orderId.value)
  if (!order) return

  if (order.status !== 1) {
    uni.showToast({
      title: '该订单无需支付',
      icon: 'none',
    })

    setTimeout(() => {
      uni.redirectTo({
        url: `/pages/order/detail?id=${orderId.value}`,
      })
    }, 600)
  }
}

async function handlePay() {
  if (!orderDetail.value) return

  const result = await payOrder({
    id: orderDetail.value.id,
    payType: payType.value,
  })

  if (!result) return

  uni.showToast({
    title: '支付成功',
    icon: 'success',
  })

  setTimeout(() => {
    uni.redirectTo({
      url: `/pages/order/detail?id=${orderDetail.value!.id}`,
    })
  }, 800)
}

onLoad((options) => {
  orderId.value = String(options?.id || '')
  init()
})
</script>
