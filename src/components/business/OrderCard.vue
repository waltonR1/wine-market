<script setup lang="ts">
import type { OrderItem } from '@/types/model/order'

const props = defineProps<{
  order: OrderItem
}>()

const emit = defineEmits<{
  (e: 'click', order: OrderItem): void
  (e: 'action', type: string, order: OrderItem): void
}>()
</script>

<template>
  <view class="bg-white rounded-2xl p-4 mb-4 shadow-sm" @click="emit('click', props.order)">
    <view class="flex items-center justify-between pb-3 border-b border-[#F0F0F0]">
      <text class="text-[12px] text-[#999]">订单号：{{ props.order.orderNum }}</text>
      <text class="text-[13px] font-medium" :class="props.order.status === 1 ? 'text-[#C40000]' : 'text-[#666]'">
        {{ props.order.statusLabel }}
      </text>
    </view>

    <view class="py-4">
      <view v-for="item in props.order.goods" :key="item.id" class="flex items-center mb-3 last:mb-0">
        <image :src="item.image" class="w-[60px] h-[60px] rounded-lg bg-[#F5F5F5] mr-3" mode="aspectFill" />
        <view class="flex-1 min-w-0">
          <view class="text-[14px] text-[#333] font-medium truncate">{{ item.name }}</view>
          <view class="flex items-center justify-between mt-2">
            <text class="text-[13px] text-[#666]">¥{{ item.price }}</text>
            <text class="text-[12px] text-[#999]">x{{ item.count }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="flex items-center justify-between pt-3 border-t border-[#F0F0F0]">
      <view class="text-[12px] text-[#999]">{{ props.order.createTime }}</view>
      <view class="flex items-center">
        <text class="text-[12px] text-[#333] mr-1">共{{ props.order.totalCount }}件 合计:</text>
        <text class="text-[15px] font-bold text-[#333]">¥{{ props.order.totalPrice }}</text>
      </view>
    </view>

    <view class="flex justify-end mt-4 space-x-3">
      <view v-if="props.order.status === 1" class="px-4 py-1.5 rounded-full border border-[#DDD] text-[13px] text-[#666]" @click.stop="emit('action', 'cancel', props.order)">
        取消订单
      </view>
      <view v-if="props.order.status === 1" class="px-5 py-1.5 rounded-full bg-[#C40000] text-white text-[13px] font-medium" @click.stop="emit('action', 'pay', props.order)">
        立即支付
      </view>
      <view v-if="props.order.status === 3" class="px-5 py-1.5 rounded-full bg-[#C40000] text-white text-[13px] font-medium" @click.stop="emit('action', 'confirm', props.order)">
        确认收货
      </view>
      <view v-if="props.order.status === 4" class="px-4 py-1.5 rounded-full border border-[#DDD] text-[13px] text-[#666]" @click.stop="emit('action', 'comment', props.order)">
        立即评价
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">

</style>