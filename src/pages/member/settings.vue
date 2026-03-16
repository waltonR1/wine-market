<template>
  <view class="min-h-screen bg-[#F8F8F8]">

    <view class="mt-4 px-4">
      <view class="bg-white rounded-2xl overflow-hidden shadow-sm">
        <view class="px-4 py-4 flex items-center justify-between border-b border-[#F0F0F0]">
          <text class="text-[14px] text-[#333]">关于我们</text>
          <text class="text-[#999]">›</text>
        </view>
        <view class="px-4 py-4 flex items-center justify-between">
          <text class="text-[14px] text-[#333]">清除缓存</text>
          <text class="text-[#999]">›</text>
        </view>
      </view>

      <view
          v-if="isLogin"
          class="mt-8 bg-white rounded-2xl py-4 text-center text-[15px] text-[#C40000] font-medium shadow-sm active:opacity-70"
          @click="handleLogout"
      >
        退出登录
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useUser } from '@/hooks/useUser'

const { isLogin, logout } = useUser()

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        logout({ reLaunch: false })
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/index/index' })
        }, 1000)
      }
    }
  })
}
</script>
