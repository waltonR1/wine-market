<script setup lang="ts">
defineProps<{
  title: string
  desc?: string
  danger?: boolean
}>()
</script>

<template>
  <view
    class="rounded-2xl border bg-card p-4"
    :class="danger ? 'border-debug-danger bg-danger-soft' : 'border-divider'"
  >
    <view class="flex items-start justify-between">
      <view>
        <view class="text-[15px] font-semibold" :class="danger ? 'text-debug-danger' : 'text-text-main'">
          {{ title }}
        </view>
        <view v-if="desc" class="mt-1 text-[12px] leading-5" :class="danger ? 'text-status-refunding' : 'text-text-secondary'">
          {{ desc }}
        </view>
      </view>
      <slot name="extra" />
    </view>
    <view class="mt-4">
      <slot />
    </view>
  </view>
</template>
