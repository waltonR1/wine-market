<template>
  <view class="min-h-screen bg-[#F7F3EE] pb-8">
    <!-- 未登录状态 -->
    <template v-if="!isLogin">
      <view class="px-4 pt-4">
        <view class="rounded-3xl bg-[#4A0D12] px-5 py-6 text-white shadow-lg">
          <view class="flex items-center">
            <view
                class="w-[64px] h-[64px] rounded-full bg-[#C9A96E] flex items-center justify-center text-[26px]"
            >
              🍷
            </view>

            <view class="ml-4 flex-1">
              <view class="text-[20px] font-bold">
                欢迎来到 Wine Market
              </view>
              <view class="mt-1 text-[12px] text-[#E7D9C7]">
                登录后查看订单、收藏、积分与会员权益
              </view>
            </view>
          </view>

          <view
              class="mt-6 bg-[#6B0F1A] text-white text-center py-3 rounded-2xl text-[15px] font-medium"
              @click="goLogin"
          >
            立即登录
          </view>
        </view>
      </view>
    </template>

    <!-- 已登录状态 -->
    <template v-else>
      <!-- 顶部用户卡片 -->
      <view class="px-4 pt-4">
        <view class="rounded-3xl bg-[#4A0D12] px-5 py-6 text-white shadow-lg">
          <view class="flex items-center">
            <view
                class="w-[64px] h-[64px] rounded-full bg-[#C9A96E] flex items-center justify-center text-[26px]"
            >
              🍷
            </view>

            <view class="ml-4 flex-1">
              <view class="text-[20px] font-bold">
                {{ profile.nickname }}
              </view>
              <view class="mt-1 text-[12px] text-[#E7D9C7]">
                {{ profile.welcomeText }}
              </view>
            </view>

            <view
                class="px-3 py-1 rounded-full border border-[#C9A96E] text-[#F8E7C8] text-[12px]"
            >
              会员中心
            </view>
          </view>

          <view class="mt-5 grid grid-cols-3 gap-3">
            <view class="rounded-2xl bg-[#6B0F1A] py-3 text-center">
              <view class="text-[18px] font-bold text-[#F8E7C8]">
                {{ profile.favoriteCount }}
              </view>
              <view class="mt-1 text-[11px] text-[#F5EBDD]">
                收藏酒款
              </view>
            </view>

            <view class="rounded-2xl bg-[#6B0F1A] py-3 text-center">
              <view class="text-[18px] font-bold text-[#F8E7C8]">
                {{ profile.pendingReceiveCount }}
              </view>
              <view class="mt-1 text-[11px] text-[#F5EBDD]">
                待收货
              </view>
            </view>

            <view class="rounded-2xl bg-[#6B0F1A] py-3 text-center">
              <view class="text-[18px] font-bold text-[#F8E7C8]">
                {{ profile.points }}
              </view>
              <view class="mt-1 text-[11px] text-[#F5EBDD]">
                积分
              </view>
            </view>
          </view>
        </view>
      </view>
    </template>

    <!-- 我的订单 -->
    <view class="px-4 mt-5">
      <view class="bg-white rounded-3xl p-4 shadow-sm">
        <view class="flex items-center justify-between">
          <view class="text-[16px] font-bold text-[#2C2C2C]">
            我的订单
          </view>
          <view
              class="text-[12px] text-[#8B7B6B]"
              @click="goOrderList"
          >
            查看全部订单
          </view>
        </view>

        <view class="grid grid-cols-4 gap-3 mt-4 text-center">
          <view class="flex flex-col items-center" @click="goOrderList">
            <view class="text-[22px]">💳</view>
            <view class="mt-2 text-[12px] text-[#4B3A2F]">待付款</view>
          </view>

          <view class="flex flex-col items-center" @click="goOrderList">
            <view class="text-[22px]">📦</view>
            <view class="mt-2 text-[12px] text-[#4B3A2F]">待发货</view>
          </view>

          <view class="flex flex-col items-center" @click="goOrderList">
            <view class="text-[22px]">🚚</view>
            <view class="mt-2 text-[12px] text-[#4B3A2F]">待收货</view>
          </view>

          <view class="flex flex-col items-center" @click="goOrderList">
            <view class="text-[22px]">⭐</view>
            <view class="mt-2 text-[12px] text-[#4B3A2F]">待评价</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 常用功能 -->
    <view class="px-4 mt-5">
      <view class="bg-white rounded-3xl p-4 shadow-sm">
        <view class="text-[16px] font-bold text-[#2C2C2C] mb-4">
          常用功能
        </view>

        <view class="space-y-3">
          <view class="flex items-center justify-between py-2" @click="requireLoginAction('收货地址')">
            <view class="flex items-center">
              <view class="text-[18px] mr-3">📍</view>
              <view class="text-[14px] text-[#2C2C2C]">收货地址</view>
            </view>
            <view class="text-[#8B7B6B]">›</view>
          </view>

          <view class="flex items-center justify-between py-2" @click="requireLoginAction('优惠券')">
            <view class="flex items-center">
              <view class="text-[18px] mr-3">🎟️</view>
              <view class="text-[14px] text-[#2C2C2C]">优惠券</view>
            </view>
            <view class="text-[#8B7B6B]">›</view>
          </view>

          <view class="flex items-center justify-between py-2" @click="requireLoginAction('我的收藏')">
            <view class="flex items-center">
              <view class="text-[18px] mr-3">❤️</view>
              <view class="text-[14px] text-[#2C2C2C]">我的收藏</view>
            </view>
            <view class="text-[#8B7B6B]">›</view>
          </view>

          <view class="flex items-center justify-between py-2">
            <view class="flex items-center">
              <view class="text-[18px] mr-3">🏰</view>
              <view class="text-[14px] text-[#2C2C2C]">品牌故事</view>
            </view>
            <view class="text-[#8B7B6B]">›</view>
          </view>

          <view class="flex items-center justify-between py-2">
            <view class="flex items-center">
              <view class="text-[18px] mr-3">☎️</view>
              <view class="text-[14px] text-[#2C2C2C]">联系客服</view>
            </view>
            <view class="text-[#8B7B6B]">›</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view v-if="isLogin" class="px-4 mt-5">
      <view
          class="bg-white rounded-3xl p-4 shadow-sm text-center text-[15px] text-[#6B0F1A] font-medium"
          @click="handleLogout"
      >
        退出登录
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getMemberProfile } from '@/api'
import type { MemberProfile } from '@/types/model/member'
import { hasToken, removeToken } from '@/utils/auth'

const isLogin = ref(false)

const profile = ref<MemberProfile>({
  nickname: '',
  welcomeText: '',
  favoriteCount: 0,
  pendingReceiveCount: 0,
  points: 0,
})

onShow(async () => {
  isLogin.value = hasToken()

  if (!isLogin.value) {
    return
  }

  const res = await getMemberProfile()

  if (res.code === 0) {
    profile.value = res.data
  } else {
    uni.showToast({
      title: res.message || '个人信息加载失败',
      icon: 'none',
    })
  }
})

function goLogin() {
  uni.navigateTo({
    url: '/pages/login/index?redirect=%2Fpages%2Fmember%2Findex',
  })
}

function requireLoginAction(name: string) {
  if (!isLogin.value) {
    uni.showToast({
      title: `请先登录后查看${name}`,
      icon: 'none',
    })

    setTimeout(() => {
      goLogin()
    }, 300)
    return
  }

  uni.showToast({
    title: `${name}功能开发中`,
    icon: 'none',
  })
}

function goOrderList() {
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
    url: '/pages/order/list',
  })
}

function handleLogout() {
  removeToken()
  isLogin.value = false

  uni.showToast({
    title: '已退出登录',
    icon: 'success',
  })
}
</script>