<template>
  <view class="min-h-screen bg-background pb-[110px]">
    <view v-if="pageLoading" class="p-4 text-[14px] text-text-secondary">加载中...</view>

    <template v-else-if="orderDetail">
      <view class="mx-3 mt-3 rounded-2xl bg-card p-4">
        <view class="text-[16px] font-semibold text-text-main">{{ pageTitle }}</view>
        <view class="mt-2 text-[12px] text-text-muted">订单号：{{ orderDetail.orderNum }}</view>
      </view>

      <view class="mx-3 mt-3 rounded-2xl bg-card p-4">
        <view class="mb-3 text-[15px] font-semibold text-text-main">商品信息</view>
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

      <view v-if="!isAppendMode" class="mx-3 mt-3 rounded-2xl bg-card p-4">
        <view class="text-[15px] font-semibold text-text-main">星级评分</view>
        <view class="mt-4 flex items-center gap-2">
          <view
            v-for="star in 5"
            :key="star"
            class="text-[28px]"
            :class="star <= score ? 'text-warning' : 'text-text-disabled'"
            @click="setScore(star)"
          >
            鈽?          </view>
          <text class="ml-2 text-[13px] text-text-muted">{{ score }}/5</text>
        </view>
        <view class="mt-2 text-[12px] text-text-muted">支持 0-5 星，点击星星即可评分。</view>
      </view>

      <view class="mx-3 mt-3 rounded-2xl bg-card p-4">
        <view class="text-[15px] font-semibold text-text-main">{{ contentTitle }}</view>
        <textarea
          v-model="content"
          class="mt-3 h-[140px] w-full rounded-2xl bg-surface-soft p-3 text-[14px] text-text-main"
          maxlength="200"
          :placeholder="contentPlaceholder"
        />
        <view class="mt-2 text-right text-[12px] text-text-muted">{{ content.length }}/200</view>

        <view v-if="!isAppendMode" class="mt-4 flex items-center justify-between rounded-2xl bg-surface-muted px-4 py-3">
          <view>
            <view class="text-[14px] text-text-main">匿名评价</view>
            <view class="mt-1 text-[12px] text-text-muted">提交后将以匿名用户展示评价。</view>
          </view>
          <switch :checked="anonymous" :color="COLORS['status-pending']" @change="handleAnonymousChange" />
        </view>

        <view class="mt-5 text-[15px] font-semibold text-text-main">图片占位</view>
        <view class="mt-3 flex flex-wrap gap-3">
          <view
            v-for="image in IMAGE_PLACEHOLDERS"
            :key="image"
            class="relative h-[76px] w-[76px] overflow-hidden rounded-2xl border"
            :class="selectedImages.includes(image) ? 'border-status-pending' : 'border-border'"
            @click="toggleImage(image)"
          >
            <image :src="image" class="h-full w-full bg-surface-soft" mode="aspectFill" />
            <view class="absolute inset-x-0 bottom-0 bg-overlay-mask py-1 text-center text-[11px] text-text-inverse">
              {{ selectedImages.includes(image) ? '已选择' : '点击添加' }}
            </view>
          </view>
        </view>
        <view class="mt-2 text-[12px] text-text-muted">当前阶段使用图片占位，后续可替换为真实上传。</view>
      </view>
    </template>

    <view v-else class="p-4 text-[14px] text-text-secondary">订单不存在</view>

    <view class="fixed bottom-0 left-0 right-0 border-t border-divider bg-card px-4 py-3">
      <button
        class="h-[42px] rounded-full bg-status-pending text-[14px] leading-[42px] text-text-inverse"
        :disabled="!orderDetail || actionLoading || pageMode === 'readonly'"
        :loading="actionLoading"
        @click="handleSubmit"
      >
        {{ pageMode === 'readonly' ? '已完成追评' : submitText }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { COLORS } from '@/constants'
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useOrder } from '@/hooks/useOrder'
import type { CommentMode } from '@/types/model/order'

const IMAGE_PLACEHOLDERS = [
  'https://placehold.co/160x160/F4E7DD/7A4B2F.png?text=Pic+1',
  'https://placehold.co/160x160/E8EEF4/4A5A70.png?text=Pic+2',
  'https://placehold.co/160x160/F1E7E9/8D4F5A.png?text=Pic+3',
]

const orderId = ref('')
const score = ref(0)
const content = ref('')
const anonymous = ref(false)
const selectedImages = ref<string[]>([])
const pageMode = ref<'initial' | 'append' | 'readonly'>('initial')
const { pageLoading, actionLoading, orderDetail, fetchOrderDetail, submitComment } = useOrder()

const isAppendMode = computed(() => pageMode.value === 'append')
const pageTitle = computed(() => (isAppendMode.value ? '追加评价' : '订单评价'))
const contentTitle = computed(() => (isAppendMode.value ? '追评内容' : '评论内容'))
const contentPlaceholder = computed(() =>
  isAppendMode.value
    ? '补充你的后续使用体验，帮助其他用户更全面地了解商品。'
    : '写下你的真实体验，帮助其他用户更好地了解商品。'
)
const submitText = computed(() => (isAppendMode.value ? '提交追评' : '提交评价'))

function setPageModeByOrder(explicitMode?: CommentMode) {
  if (!orderDetail.value) {
    pageMode.value = 'initial'
    return
  }

  anonymous.value = Boolean(orderDetail.value.commentAnonymous)

  if (explicitMode === 'append') {
    if (orderDetail.value.closeReason === 'commented' && !orderDetail.value.appendCommentTime) {
      pageMode.value = 'append'
      return
    }
    pageMode.value = 'readonly'
    return
  }

  if (orderDetail.value.status === 4) {
    pageMode.value = 'initial'
    return
  }

  if (orderDetail.value.closeReason === 'commented' && !orderDetail.value.appendCommentTime) {
    pageMode.value = 'append'
    return
  }

  pageMode.value = 'readonly'
}

async function init(explicitMode?: CommentMode) {
  if (!orderId.value) return

  const detail = await fetchOrderDetail(orderId.value)
  if (!detail) return

  setPageModeByOrder(explicitMode)

  if (pageMode.value === 'readonly') {
    uni.showToast({
      title: '当前订单不可再评价',
      icon: 'none',
    })
  }
}

function handleAnonymousChange(event: { detail?: { value?: boolean } }) {
  anonymous.value = Boolean(event.detail?.value)
}

function toggleImage(image: string) {
  if (pageMode.value === 'readonly') return

  if (selectedImages.value.includes(image)) {
    selectedImages.value = selectedImages.value.filter(item => item !== image)
    return
  }

  if (selectedImages.value.length >= 3) {
    uni.showToast({ title: '最多选择 3 张图片', icon: 'none' })
    return
  }

  selectedImages.value = [...selectedImages.value, image]
}

function setScore(value: number) {
  if (isAppendMode.value || pageMode.value === 'readonly') return
  score.value = value === score.value ? 0 : value
}

async function handleSubmit() {
  if (!orderDetail.value || actionLoading.value || pageMode.value === 'readonly') return

  if (!isAppendMode.value && (score.value < 0 || score.value > 5)) {
    uni.showToast({ title: '评分范围应为 0-5 星', icon: 'none' })
    return
  }

  if (!content.value.trim()) {
    uni.showToast({ title: isAppendMode.value ? '请填写追评内容' : '请填写评论内容', icon: 'none' })
    return
  }

  const ok = await submitComment({
    id: String(orderDetail.value.id),
    score: isAppendMode.value ? orderDetail.value.commentScore || 0 : score.value,
    content: content.value.trim(),
    anonymous: isAppendMode.value ? orderDetail.value.commentAnonymous : anonymous.value,
    images: selectedImages.value,
    mode: isAppendMode.value ? 'append' : 'initial',
  })

  if (!ok) return

  uni.showToast({ title: isAppendMode.value ? '追评已提交' : '评价已提交', icon: 'success' })
  setTimeout(() => {
    uni.redirectTo({
      url: `/pages/order/detail?id=${orderDetail.value?.id}`,
    })
  }, 300)
}

onLoad((options) => {
  orderId.value = String(options?.id || '')
  const mode = String(options?.mode || '') === 'append' ? 'append' : undefined
  init(mode)
})
</script>



