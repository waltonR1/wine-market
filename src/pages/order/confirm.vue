<template>
  <view class="min-h-screen bg-[#F7F3EE] pb-[120px]">

    <!-- 收货地址 -->
    <view class="bg-white px-4 py-4 flex items-center justify-between">
      <view>
        <view class="text-[14px] font-medium text-[#333]">
          张三 13800000000
        </view>

        <view class="text-[12px] text-[#666] mt-1">
          北京市 朝阳区 酒仙桥路 88号
        </view>
      </view>

      <view class="text-[#999]">
        >
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="bg-white mt-3">

      <view
          v-for="item in orderList"
          :key="item.id"
          class="flex px-4 py-4 border-b border-[#eee]"
      >

        <image
            :src="item.image"
            class="w-[90px] h-[90px] bg-[#EFE7DE]"
            mode="aspectFill"
        />

        <view class="flex-1 ml-3 flex flex-col justify-between">

          <view class="text-[14px] text-[#333] leading-5">
            {{ item.name }}
          </view>

          <view class="text-[12px] text-[#888]">
            {{ item.spec }}
          </view>

          <view class="flex items-center justify-between">

            <view class="text-[#C40000] text-[16px] font-medium">
              ¥{{ item.price }}
            </view>

            <view class="text-[13px] text-[#666]">
              ×{{ item.count }}
            </view>

          </view>

        </view>

      </view>

    </view>

    <!-- 配送方式 -->
    <view class="bg-white mt-3 px-4 py-4 flex justify-between">
      <view class="text-[14px] text-[#333]">
        配送方式
      </view>

      <view class="text-[13px] text-[#666]">
        快递配送
      </view>
    </view>

    <!-- 订单备注 -->
    <view class="bg-white mt-3 px-4 py-4">

      <view class="text-[14px] text-[#333]">
        订单备注
      </view>

      <input
          placeholder="选填：给商家留言"
          class="mt-3 bg-[#F5F5F5] rounded-lg px-3 py-2 text-[13px]"
      />

    </view>

    <!-- 费用 -->
    <view class="bg-white mt-3 px-4 py-4">

      <view class="flex justify-between text-[13px] text-[#666]">
        <view>商品金额</view>
        <view>¥{{ totalPrice }}</view>
      </view>

      <view class="flex justify-between text-[13px] text-[#666] mt-2">
        <view>运费</view>
        <view>¥0</view>
      </view>

    </view>

  </view>

  <!-- 底部提交 -->
  <view class="fixed bottom-0 left-0 right-0 bg-white border-t border-[#eee] px-4 py-3 flex items-center justify-between">

    <view class="text-[14px]">
      合计：
      <text class="text-[#C40000] text-[18px] font-bold">
        ¥{{ totalPrice }}
      </text>
    </view>

    <view
        class="bg-[#6B0F1A] text-white px-6 py-2 rounded-full text-[14px]"
        @click="submitOrder"
    >
      提交订单
    </view>

  </view>

</template>

<script setup lang="ts">

import { computed } from 'vue'

const orderList = [
  {
    id: 1,
    name: 'Château Bordeaux Rouge',
    spec: '法国波尔多干红',
    price: 199,
    count: 1,
    image: '/static/logo.png'
  },
  {
    id: 2,
    name: 'Champagne Brut Réserve',
    spec: '香槟区起泡酒',
    price: 399,
    count: 1,
    image: '/static/logo.png'
  }
]

const totalPrice = computed(() => {
  return orderList.reduce((sum, item) => {
    return sum + item.price * item.count
  }, 0)
})

function submitOrder() {
  uni.showToast({
    title: '订单已提交',
    icon: 'success'
  })
}

</script>