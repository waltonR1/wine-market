<template>
  <view class="min-h-screen bg-background pb-8">
    <!-- 用户卡片区 -->
    <view class="px-4 pt-4">
      <view class="rounded-3xl bg-primary px-5 py-6 text-white shadow-lg relative overflow-hidden">
        <!-- 装饰图 -->
        <view class="absolute right-[-20px] top-[-20px] opacity-10 text-[100px]">🍷</view>

        <!-- 登录状态 -->
        <template v-if="isLogin">
          <view class="flex items-center">
            <view class="w-[64px] h-[64px] rounded-full bg-[#C9A96E] flex items-center justify-center text-[26px]">
              🍷
            </view>
            <view class="ml-4 flex-1">
              <view class="text-[20px] font-bold">{{ profile.nickname }}</view>
              <view class="mt-1 text-[12px] text-border">{{ profile.welcomeText }}</view>
            </view>
            <view class="px-3 py-1 rounded-full border border-[#C9A96E] text-secondary text-[12px]">
              会员中心
            </view>
          </view>
        </template>

        <!-- 未登录状态 -->
        <template v-else>
          <view class="flex items-center">
            <view class="w-[64px] h-[64px] rounded-full bg-[#C9A96E] flex items-center justify-center text-[26px]">
              👤
            </view>
            <view class="ml-4 flex-1">
              <view class="text-[20px] font-bold">欢迎来到 Wine Market</view>
              <view class="mt-1 text-[12px] text-border">登录后查看订单、积分与会员权益</view>
            </view>
          </view>
          <view class="mt-6 bg-accent text-white text-center py-3 rounded-2xl text-[15px] font-medium shadow-inner" @click="goLogin">
            立即登录
          </view>
        </template>
      </view>
    </view>

    <!-- 订单状态区 -->
    <view class="px-4 mt-5">
      <view class="bg-white rounded-3xl p-4 shadow-sm flex justify-between items-center text-center">
        <view v-for="item in orderStatusList" :key="item.label" class="flex-1 flex flex-col items-center relative" @click="goOrderList(item.status)">
          <view class="text-[24px] mb-1">{{ item.icon }}</view>
          <view class="text-[11px] text-[#4B3A2F]">{{ item.label }}</view>
          <!-- 数量角标 -->
          <view v-if="isLogin && item.count > 0" class="absolute top-0 right-[15%] bg-[#C40000] text-white text-[10px] min-w-[14px] h-[14px] rounded-full flex items-center justify-center px-1">
            {{ item.count }}
          </view>
        </view>
      </view>
    </view>

    <!-- 常用功能 -->
    <view class="px-4 mt-5">
      <view class="bg-white rounded-3xl p-5 shadow-sm">
        <view class="flex items-center mb-5">
          <view class="w-1 h-4 bg-[#A6814C] rounded-full mr-2"></view>
          <text class="text-[16px] font-bold text-text-main">常用功能</text>
          <text class="text-[10px] text-[#999] ml-2 italic">Common Functions</text>
        </view>

        <view class="grid grid-cols-4 gap-y-6">
          <view v-for="item in commonFunctions" :key="item.label" class="flex flex-col items-center" @click="handleFunctionClick(item)">
            <view class="text-[22px] mb-2">{{ item.icon }}</view>
            <view class="text-[11px] text-[#4B3A2F]">{{ item.label }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 功能选单 -->
    <view class="px-4 mt-5">
      <view class="bg-white rounded-3xl p-5 shadow-sm">
        <view class="flex items-center mb-5">
          <view class="w-1 h-4 bg-[#A6814C] rounded-full mr-2"></view>
          <text class="text-[16px] font-bold text-text-main">功能选单</text>
          <text class="text-[10px] text-[#999] ml-2 italic">Function Menu</text>
        </view>

        <view class="grid grid-cols-4 gap-y-6">
          <view v-for="item in menuFunctions" :key="item.label" class="flex flex-col items-center" @click="handleFunctionClick(item)">
            <view class="text-[22px] mb-2">{{ item.icon }}</view>
            <view class="text-[11px] text-[#4B3A2F]">{{ item.label }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view v-if="isLogin" class="px-4 mt-6">
      <view class="bg-white rounded-2xl p-4 shadow-sm text-center text-[15px] text-accent font-medium active:opacity-70" @click="handleLogout">
        退出登录
      </view>
    </view>

    <!-- 版权信息 -->
    <view class="mt-10 text-center pb-6">
      <view class="text-[11px] text-text-secondary opacity-60">© Wine Market 版权所有</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useMember } from '@/hooks/useMember'
import { useUser } from '@/hooks/useUser'

const { isLogin, logout } = useUser()
const { profile, fetchProfile, reset } = useMember()

const orderStatusList = computed(() => [
  { label: '待付款', icon: '💳', status: 1, count: profile.value.pendingPayCount },
  { label: '待发货', icon: '📦', status: 2, count: profile.value.pendingShipCount },
  { label: '待收货', icon: '🚚', status: 3, count: profile.value.pendingReceiveCount },
  { label: '待评价', icon: '⭐', status: 4, count: profile.value.pendingRateCount },
  { label: '退换货', icon: '🔄', status: 5, count: profile.value.returnCount },
])

const commonFunctions = [
  { label: '我的钱包', icon: '👛', path: '/pages/member/wallet' },
  { label: '我的优惠券', icon: '🎟️', path: '/pages/member/coupons' },
  { label: '我的积分', icon: '🎖️', path: '/pages/member/points' },
  { label: '我的收藏', icon: '❤️', path: '/pages/member/collection' },
  { label: '推广中心', icon: '🌐', path: '/pages/member/promotion' },
  { label: '分享好友', icon: '📄', path: '/pages/member/share' },
  { label: '我的足迹', icon: '💡', path: '/pages/member/footprints' },
  { label: '个人信息', icon: '👤', path: '/pages/member/info' },
  { label: '我的发票', icon: '🧾', path: '/pages/member/invoice' },
]

const menuFunctions = [
  { label: '实名认证', icon: '🛡️', path: '/pages/member/realname' },
  { label: '地址管理', icon: '📍', path: '/pages/member/address' },
  { label: '系统设置', icon: '⚙️', path: '/pages/member/settings' },
]

onShow(async () => {
  if (!isLogin.value) {
    return
  }
  await fetchProfile()
})

function goLogin() {
  uni.navigateTo({
    url: '/pages/login/index?redirect=%2Fpages%2Fmember%2Findex',
  })
}

function handleFunctionClick(item: any) {
  if (!isLogin.value && item.label !== '系统设置') {
    uni.showToast({
      title: `请先登录后查看${item.label}`,
      icon: 'none',
    })
    setTimeout(() => {
      goLogin()
    }, 300)
    return
  }

  if (item.path) {
    uni.navigateTo({ url: item.path })
  } else {
    uni.showToast({
      title: `${item.label}功能开发中`,
      icon: 'none',
    })
  }
}

function goOrderList(status?: number) {
  if (!isLogin.value) {
    uni.showToast({
      title: '请先登录后查看订单',
      icon: 'none',
    })
    setTimeout(() => {
      goLogin()
    }, 300)
    return
  }

  uni.navigateTo({
    url: `/pages/order/list?status=${status || 0}`,
  })
}

function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        logout({ reLaunch: false })
        reset()
      }
    }
  })
}
</script>

<style scoped>
page {
  background-color: #F7F3EE;
}
</style>
