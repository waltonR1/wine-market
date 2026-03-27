<script setup lang="ts">
import { computed } from 'vue'
import type { OrderAction, OrderItem } from '@/types/model/order'
import { getOrderActions } from '@/utils/order'

const props = defineProps<{
  order: OrderItem
}>()

const emit = defineEmits<{
  (e: 'click', order: OrderItem): void
  (e: 'action', type: OrderAction, order: OrderItem): void
}>()

const allActions = computed(() => getOrderActions(props.order))
const visibleActions = computed(() => (allActions.value.length > 3 ? allActions.value.slice(0, 2) : allActions.value))
const hiddenActions = computed(() => (allActions.value.length > 3 ? allActions.value.slice(2) : []))

function getActionClass(style: 'primary' | 'secondary' | 'rebuy' | 'danger') {
  switch (style) {
    case 'primary':
      return 'rounded-full bg-status-pending px-4 py-1.5 text-[12px] font-medium text-text-inverse'
    case 'rebuy':
      return 'rounded-full border border-status-shipping bg-surface-warm px-4 py-1.5 text-[12px] font-medium text-status-shipping'
    case 'danger':
      return 'rounded-full border border-danger-border bg-card px-4 py-1.5 text-[12px] text-status-refunding'
    default:
      return 'rounded-full border border-divider bg-card px-4 py-1.5 text-[12px] text-text-secondary'
  }
}

function openMoreActions() {
  if (hiddenActions.value.length === 0) return

  uni.showActionSheet({
    itemList: hiddenActions.value.map(item => item.text),
    success: ({ tapIndex }) => {
      const action = hiddenActions.value[tapIndex]
      if (!action) return
      emit('action', action.type, props.order)
    },
  })
}
</script>

<template>
  <view class="mb-4 rounded-2xl bg-card p-4 shadow-sm" @click="emit('click', props.order)">
    <view class="flex items-center justify-between border-b border-divider pb-3">
      <text class="text-[12px] text-text-muted">订单号：{{ props.order.orderNum }}</text>
      <text class="text-[13px] font-medium" :class="props.order.status === 1 ? 'text-status-pending' : 'text-status-cancelled'">
        {{ props.order.statusLabel }}
      </text>
    </view>

    <view class="py-4">
      <view v-for="item in props.order.goods" :key="item.id" class="mb-3 flex items-center last:mb-0">
        <image :src="item.image" class="mr-3 h-[60px] w-[60px] rounded-lg bg-surface-muted" mode="aspectFill" />
        <view class="min-w-0 flex-1">
          <view class="truncate text-[14px] font-medium text-text-main">{{ item.name }}</view>
          <view class="mt-2 flex items-center justify-between">
            <text class="text-[13px] text-text-secondary">¥{{ item.price }}</text>
            <text class="text-[12px] text-text-muted">x{{ item.count }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="flex items-center justify-between border-t border-divider pt-3">
      <view class="text-[12px] text-text-muted">{{ props.order.createTime }}</view>
      <view class="flex items-center">
        <text class="mr-1 text-[12px] text-text-main">共{{ props.order.totalCount }}件 合计:</text>
        <text class="text-[15px] font-bold text-text-main">¥{{ props.order.payPrice }}</text>
      </view>
    </view>

    <view
      v-if="props.order.commentContent"
      class="mt-3 rounded-2xl bg-surface-warm px-3 py-2 text-[12px] leading-5 text-text-secondary"
    >
      <text class="mr-1 text-status-shipping">已评价:</text>
      <text>{{ props.order.commentContent }}</text>
    </view>

    <view v-if="allActions.length > 0" class="mt-4 flex items-center justify-end gap-2 whitespace-nowrap">
      <view
        v-if="hiddenActions.length > 0"
        class="flex h-[28px] w-[28px] items-center justify-center rounded-full border border-divider bg-card text-[12px] text-text-secondary"
        @click.stop="openMoreActions"
      >
        ...
      </view>
      <view
        v-for="action in visibleActions"
        :key="action.type"
        :class="getActionClass(action.style)"
        @click.stop="emit('action', action.type, props.order)"
      >
        {{ action.text }}
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
</style>
