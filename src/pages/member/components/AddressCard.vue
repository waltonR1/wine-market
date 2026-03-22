<template>
  <view class="bg-white rounded-2xl p-4 mb-4 shadow-sm">
    <view class="flex justify-between items-start mb-2">
      <view class="flex items-center">
        <text class="text-[16px] font-bold mr-3">{{ item.name }}</text>
        <text class="text-[14px] text-[#666]">{{ item.phone }}</text>
      </view>
      <view
        v-if="item.isDefault"
        class="bg-accent text-white text-[10px] px-2 py-0.5 rounded-md"
      >
        默认
      </view>
    </view>

    <view class="text-[13px] text-[#333] mb-4 leading-relaxed">
      {{ formatAddress(item) }}
    </view>

    <view v-if="!selectMode" class="border-t border-[#F5F5F5] pt-3 flex justify-between items-center">
      <view>
        <view
          v-if="!item.isDefault"
          class="text-[12px] text-accent"
          @click.stop="$emit('setDefault', item)"
        >
          设为默认
        </view>
      </view>

      <view class="flex justify-end gap-4">
        <view class="flex items-center text-[12px] text-[#666]" @click.stop="$emit('edit', item)">
          <text class="mr-1">✏️</text> 编辑
        </view>
        <view class="flex items-center text-[12px] text-[#666]" @click.stop="$emit('delete', item)">
          <text class="mr-1">🗑️</text> 删除
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { AddressInfo } from '@/types/model/address'
import {formatAddress} from "@/utils/format";

defineProps<{
  item: AddressInfo
  selectMode?: boolean
}>()

defineEmits<{
  (e: 'edit', item: AddressInfo): void
  (e: 'delete', item: AddressInfo): void
  (e: 'setDefault', item: AddressInfo): void
}>()
</script>
