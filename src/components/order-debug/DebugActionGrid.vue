<script setup lang="ts">
type ActionTone = 'primary' | 'secondary' | 'warning' | 'danger'

defineProps<{
  actions: Array<{
    key: string
    label: string
    desc?: string
    tone?: ActionTone
    disabled?: boolean
    loading?: boolean
  }>
}>()

const emit = defineEmits<{
  (e: 'action', key: string): void
}>()

function getActionClass(tone: ActionTone = 'secondary', disabled = false) {
  if (disabled) {
    return 'border-border bg-surface-soft text-text-disabled'
  }

  switch (tone) {
    case 'primary':
      return 'border-cta bg-cta text-text-inverse'
    case 'warning':
      return 'border-debug-warning bg-warning-soft text-debug-warning'
    case 'danger':
      return 'border-debug-danger bg-danger-soft text-debug-danger'
    default:
      return 'border-divider bg-card text-text-main'
  }
}
</script>

<template>
  <view class="grid grid-cols-2 gap-3">
    <view
      v-for="action in actions"
      :key="action.key"
      class="rounded-2xl border px-3 py-3"
      :class="getActionClass(action.tone, Boolean(action.disabled || action.loading))"
      @click="!action.disabled && !action.loading && emit('action', action.key)"
    >
      <view class="text-[13px] font-medium">{{ action.loading ? '执行中...' : action.label }}</view>
      <view v-if="action.desc" class="mt-1 text-[11px] leading-4 opacity-80">{{ action.desc }}</view>
    </view>
  </view>
</template>
