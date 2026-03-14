<script setup lang="ts">
interface Props {
  icon?: string
  message?: string
  buttonText?: string
  showButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: '🛒',
  message: '暂无数据',
  buttonText: '去逛逛',
  showButton: false,
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click')
}
</script>

<template>
  <view class="flex flex-col items-center justify-center py-20 px-10">
    <view class="text-[60px] opacity-20 mb-4">
      {{ icon }}
    </view>
    <view class="text-[14px] text-[#999] mb-8">
      {{ message }}
    </view>
    <view
        v-if="showButton"
        class="px-8 py-2.5 rounded-full border border-[#6B0F1A] text-[#6B0F1A] text-[14px] active:opacity-70 transition-opacity"
        @click="handleClick"
    >
      {{ buttonText }}
    </view>
  </view>
</template>

<style scoped >
</style>
