<template>
  <view class="bg-card rounded-2xl p-4 mb-4 shadow-sm">
    <view class="flex justify-between items-start mb-2">
      <view class="flex items-center">
        <text class="text-[16px] font-bold mr-3">{{ item.name }}</text>
        <text class="text-[14px] text-text-secondary">{{ item.phone }}</text>
      </view>
      <view
        v-if="item.isDefault"
        class="bg-tag-brand text-text-inverse text-[10px] px-2 py-0.5 rounded-md"
      >
        默认
      </view>
    </view>

    <view class="text-[13px] text-text-main mb-4 leading-relaxed">
      {{ formatAddress(item) }}
    </view>

    <view class="border-t border-divider pt-3 flex justify-between items-center">
      <view>
        <view v-if="showSetDefault" class="text-[12px] text-link" @click.stop="$emit('setDefault', item)">
          设为默认
        </view>
      </view>

      <view class="flex justify-end gap-4">
        <view class="flex items-center text-[12px] text-text-secondary" @click.stop="$emit('edit', item)">
          <text class="mr-1">✏️</text>
          编辑
        </view>

        <view v-if="showDelete" class="flex items-center text-[12px] text-text-secondary" @click.stop="$emit('delete', item)">
          <text class="mr-1">🗑️</text>
          删除
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type {AddressInfo} from '@/types/model/address'
import {formatAddress} from "@/utils/format";
import {computed} from "vue";

const props = defineProps<{
  item: AddressInfo
  selectMode?: boolean
}>()

const showSetDefault = computed(() => !props.selectMode && !props.item.isDefault)
const showDelete = computed(() => !props.selectMode)

defineEmits<{
  (e: 'edit', item: AddressInfo): void
  (e: 'delete', item: AddressInfo): void
  (e: 'setDefault', item: AddressInfo): void
}>()
</script>

