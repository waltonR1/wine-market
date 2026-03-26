<template>
  <view class="min-h-screen bg-[#F8F8F8] pb-[110px]">
    <view v-if="pageLoading" class="p-4 text-[14px] text-[#666]">加载中...</view>

    <template v-else-if="orderDetail">
      <view class="mx-3 mt-3 rounded-2xl bg-white p-4">
        <view class="text-[16px] font-semibold text-[#333]">退款/售后</view>
        <view class="mt-2 text-[12px] text-[#999]">订单号：{{ orderDetail.orderNum }}</view>
      </view>

      <view class="mx-3 mt-3 rounded-2xl bg-white p-4">
        <view class="mb-3 text-[15px] font-semibold text-[#333]">售后商品</view>
        <view
          v-for="item in orderDetail.goods"
          :key="item.id"
          class="flex border-b border-[#F3F3F3] py-3 last:border-b-0"
        >
          <image :src="item.image" class="h-[72px] w-[72px] rounded-xl bg-[#F7F7F7]" mode="aspectFill" />
          <view class="ml-3 flex-1">
            <view class="text-[14px] font-medium text-[#333]">{{ item.name }}</view>
            <view class="mt-2 flex items-center justify-between text-[12px] text-[#999]">
              <text>¥{{ item.price }}</text>
              <text>x{{ item.count }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="mx-3 mt-3 rounded-2xl bg-white p-4">
        <template v-if="orderDetail.afterSaleStatus === 'applying'">
          <view class="text-[15px] font-semibold text-[#333]">售后进度</view>
          <view class="mt-3 rounded-2xl bg-[#F8F8F8] p-3 text-[13px] leading-6 text-[#666]">
            <view>状态：申请中</view>
            <view v-if="orderDetail.afterSaleType">类型：{{ orderDetail.afterSaleType }}</view>
            <view v-if="orderDetail.afterSaleApplyTime">申请时间：{{ orderDetail.afterSaleApplyTime }}</view>
            <view v-if="orderDetail.afterSaleReason">原因：{{ orderDetail.afterSaleReason }}</view>
          </view>
        </template>

        <template v-else>
          <view class="text-[15px] font-semibold text-[#333]">申请信息</view>
          <view class="mt-4 flex flex-wrap gap-2">
            <view
              v-for="item in typeOptions"
              :key="item"
              class="rounded-full px-4 py-1.5 text-[13px]"
              :class="afterSaleType === item ? 'bg-[#C40000] text-white' : 'bg-[#F5F5F5] text-[#666]'"
              @click="afterSaleType = item"
            >
              {{ item }}
            </view>
          </view>
          <textarea
            v-model="reason"
            class="mt-4 h-[140px] w-full rounded-2xl bg-[#F7F7F7] p-3 text-[14px] text-[#333]"
            maxlength="200"
            placeholder="请说明退款/售后原因，后续可以扩展凭证上传、退款去向等流程。"
          />
          <view class="mt-2 text-right text-[12px] text-[#999]">{{ reason.length }}/200</view>
        </template>
      </view>
    </template>

    <view v-else class="p-4 text-[14px] text-[#666]">订单不存在</view>

    <view class="fixed bottom-0 left-0 right-0 border-t border-[#F0F0F0] bg-white px-4 py-3">
      <button
        class="h-[42px] rounded-full bg-[#C40000] text-[14px] leading-[42px] text-white"
        :disabled="!orderDetail || actionLoading || orderDetail?.afterSaleStatus === 'applying'"
        :loading="actionLoading"
        @click="submitAfterSale"
      >
        {{ orderDetail?.afterSaleStatus === 'applying' ? '售后申请已提交' : '提交申请' }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useOrder } from '@/hooks/useOrder'

const orderId = ref('')
const afterSaleType = ref('退款')
const reason = ref('')
const typeOptions = ['退款', '退货退款', '售后处理']
const { pageLoading, actionLoading, orderDetail, fetchOrderDetail, applyAfterSale } = useOrder()

async function init() {
  if (!orderId.value) return
  await fetchOrderDetail(orderId.value)
}

async function submitAfterSale() {
  if (!orderDetail.value || actionLoading.value || orderDetail.value.afterSaleStatus === 'applying') return

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

onLoad((options) => {
  orderId.value = String(options?.id || '')
  init()
})
</script>

<style scoped>
page {
  background-color: #f8f8f8;
}
</style>
