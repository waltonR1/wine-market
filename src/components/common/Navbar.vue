<script setup lang="ts">
interface Props {
  title?: string
  showBack?: boolean
  backgroundColor?: string
  textColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showBack: false,
  backgroundColor: '#F8F8F8',
  textColor: '#333333'
})

const goBack = () => {
  uni.navigateBack()
}
</script>

<template>
  <view class="navbar-placeholder h-[44px]">
    <view
        class="navbar-content fixed top-0 left-0 right-0 z-[100] h-[44px] flex items-center px-4"
        :style="{ backgroundColor: props.backgroundColor, color: props.textColor }"
    >
      <view v-if="props.showBack" class="back-btn w-[40px] flex items-center" @click="goBack">
        <text class="text-[20px]">‹</text>
      </view>
      <view class="title-area flex-1 text-center text-[16px] font-bold">
        {{ props.title }}
      </view>
      <view v-if="props.showBack" class="w-[40px]"></view>
    </view>
  </view>
</template>

<style scoped>
.navbar-content {
  /* 适配微信小程序胶囊按钮和全面屏 */
  padding-top: var(--status-bar-height);
  height: calc(44px + var(--status-bar-height));
}
.navbar-placeholder {
  height: calc(44px + var(--status-bar-height));
}
</style>