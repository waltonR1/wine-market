<template>
  <view class="min-h-screen bg-[#F7F3EE] pb-8">
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
              Walton
            </view>
            <view class="mt-1 text-[12px] text-[#E7D9C7]">
              欢迎来到 Wine Market 精品酒馆
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
            <view class="text-[18px] font-bold text-[#F8E7C8]">12</view>
            <view class="mt-1 text-[11px] text-[#F5EBDD]">收藏酒款</view>
          </view>

          <view class="rounded-2xl bg-[#6B0F1A] py-3 text-center">
            <view class="text-[18px] font-bold text-[#F8E7C8]">3</view>
            <view class="mt-1 text-[11px] text-[#F5EBDD]">待收货</view>
          </view>

          <view class="rounded-2xl bg-[#6B0F1A] py-3 text-center">
            <view class="text-[18px] font-bold text-[#F8E7C8]">2680</view>
            <view class="mt-1 text-[11px] text-[#F5EBDD]">积分</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 我的订单 -->
    <view class="px-4 mt-5">
      <view class="bg-white rounded-3xl p-4 shadow-sm">
        <view class="flex items-center justify-between">
          <view class="text-[16px] font-bold text-[#2C2C2C]">
            我的订单
          </view>
          <view class="text-[12px] text-[#8B7B6B]">
            查看全部订单
          </view>
        </view>

        <view class="grid grid-cols-4 gap-3 mt-4 text-center">
          <view class="flex flex-col items-center">
            <view class="text-[22px]">💳</view>
            <view class="mt-2 text-[12px] text-[#4B3A2F]">待付款</view>
          </view>

          <view class="flex flex-col items-center">
            <view class="text-[22px]">📦</view>
            <view class="mt-2 text-[12px] text-[#4B3A2F]">待发货</view>
          </view>

          <view class="flex flex-col items-center">
            <view class="text-[22px]">🚚</view>
            <view class="mt-2 text-[12px] text-[#4B3A2F]">待收货</view>
          </view>

          <view class="flex flex-col items-center">
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
          <view class="flex items-center justify-between py-2">
            <view class="flex items-center">
              <view class="text-[18px] mr-3">📍</view>
              <view class="text-[14px] text-[#2C2C2C]">收货地址</view>
            </view>
            <view class="text-[#8B7B6B]">›</view>
          </view>

          <view class="flex items-center justify-between py-2">
            <view class="flex items-center">
              <view class="text-[18px] mr-3">🎟️</view>
              <view class="text-[14px] text-[#2C2C2C]">优惠券</view>
            </view>
            <view class="text-[#8B7B6B]">›</view>
          </view>

          <view class="flex items-center justify-between py-2">
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
  </view>
</template>

<script setup lang="ts">
</script>