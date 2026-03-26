<template>
  <view class="min-h-screen bg-[#F8F8F8] pb-[110px]">
    <view v-if="pageLoading" class="p-4 text-[14px] text-[#666]">加载中...</view>

    <template v-else-if="orderDetail">
      <view class="mx-3 mt-3 rounded-2xl bg-white p-4">
        <view class="text-[16px] font-semibold text-[#333]">订单评价</view>
        <view class="mt-2 text-[12px] text-[#999]">订单号：{{ orderDetail.orderNum }}</view>
      </view>

      <view class="mx-3 mt-3 rounded-2xl bg-white p-4">
        <view class="mb-3 text-[15px] font-semibold text-[#333]">商品信息</view>
        <view
          v-for="item in orderDetail.goods"
          :key="item.id"
          class="flex border-b border-[#F3F3F3] py-3 last:border-b-0"
        >
          <image :src="item.image" class="h-[72px] w-[72px] rounded-xl bg-[#F7F7F7]" mode="aspectFill" />
          <view class="ml-3 flex-1">
            <view class="text-[14px] font-medium text-[#333]">{{ item.name }}</view>
            <view v-if="item.spec" class="mt-1 text-[12px] text-[#999]">{{ item.spec }}</view>
            <view class="mt-2 flex items-center justify-between text-[12px] text-[#999]">
              <text>¥{{ item.price }}</text>
              <text>x{{ item.count }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="mx-3 mt-3 rounded-2xl bg-white p-4">
        <view class="text-[15px] font-semibold text-[#333]">星级评分</view>
        <view class="mt-4 flex items-center gap-2">
          <view
            v-for="star in 5"
            :key="star"
            class="text-[28px]"
            :class="star <= score ? 'text-[#F4B83F]' : 'text-[#D8D8D8]'"
            @click="setScore(star)"
          >
            ★
          </view>
          <text class="ml-2 text-[13px] text-[#999]">{{ score }}/5</text>
        </view>
        <view class="mt-2 text-[12px] text-[#999]">支持 0-5 星，点击星星即可评分。</view>

        <view class="mt-5 text-[15px] font-semibold text-[#333]">评论内容</view>
        <textarea
          v-model="content"
          class="mt-3 h-[140px] w-full rounded-2xl bg-[#F7F7F7] p-3 text-[14px] text-[#333]"
          maxlength="200"
          placeholder="写下你的真实体验，帮助其他用户更好地了解商品。"
        />
        <view class="mt-2 text-right text-[12px] text-[#999]">{{ content.length }}/200</view>
      </view>
    </template>

    <view v-else class="p-4 text-[14px] text-[#666]">订单不存在</view>

    <view class="fixed bottom-0 left-0 right-0 border-t border-[#F0F0F0] bg-white px-4 py-3">
      <button
        class="h-[42px] rounded-full bg-[#C40000] text-[14px] leading-[42px] text-white"
        :disabled="!orderDetail || actionLoading"
        :loading="actionLoading"
        @click="submitComment"
      >
        提交评价
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useOrder } from '@/hooks/useOrder'

const orderId = ref('')
const score = ref(0)
const content = ref('')
const { pageLoading, actionLoading, orderDetail, fetchOrderDetail, submitComment: submitCommentApi } = useOrder()

async function init() {
  if (!orderId.value) return
  await fetchOrderDetail(orderId.value)
}

function setScore(value: number) {
  score.value = value === score.value ? 0 : value
}

async function submitComment() {
  if (!orderDetail.value || actionLoading.value) return

  if (score.value < 0 || score.value > 5) {
    uni.showToast({ title: '评分范围应为 0-5 星', icon: 'none' })
    return
  }

  if (!content.value.trim()) {
    uni.showToast({ title: '请填写评论内容', icon: 'none' })
    return
  }

  const ok = await submitCommentApi({
    id: String(orderDetail.value.id),
    score: score.value,
    content: content.value.trim(),
  })

  if (!ok) return

  uni.showToast({ title: '评价已提交', icon: 'success' })
  setTimeout(() => {
    uni.redirectTo({
      url: `/pages/order/detail?id=${orderDetail.value?.id}`,
    })
  }, 300)
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
