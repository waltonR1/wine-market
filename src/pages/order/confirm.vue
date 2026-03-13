<template>
  <view class="min-h-screen bg-[#F7F3EE] pb-[120px]">
    <!-- 收货地址 -->
    <view class="bg-white px-4 py-4 flex items-center justify-between">
      <view v-if="address">
        <view class="text-[14px] font-medium text-[#333]">
          {{ address.name }} {{ address.phone }}
        </view>

        <view class="text-[12px] text-[#666] mt-1">
          {{ address.detail }}
        </view>
      </view>

      <view v-else class="text-[13px] text-[#999]">
        暂无收货地址
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

      <view
          v-if="orderList.length === 0"
          class="text-center text-[14px] text-[#8B7B6B] py-10"
      >
        暂无确认订单商品
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
          v-model="remark"
          placeholder="选填：给商家留言"
          class="mt-3 bg-[#F5F5F5] rounded-lg px-3 py-2 text-[13px]"
      />
    </view>

    <!-- 费用 -->
    <view class="bg-white mt-3 px-4 py-4">
      <view class="flex justify-between text-[13px] text-[#666]">
        <view>商品金额</view>
        <view>¥{{ totalPrice.toFixed(2) }}</view>
      </view>

      <view class="flex justify-between text-[13px] text-[#666] mt-2">
        <view>运费</view>
        <view>¥0.00</view>
      </view>
    </view>
  </view>

  <!-- 底部提交 -->
  <view class="fixed bottom-0 left-0 right-0 bg-white border-t border-[#eee] px-4 py-3 flex items-center justify-between">
    <view class="text-[14px]">
      合计：
      <text class="text-[#C40000] text-[18px] font-bold">
        ¥{{ totalPrice.toFixed(2) }}
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
import { computed, ref } from 'vue'
import { getConfirmOrderList, getDefaultAddress } from '@/api'
import type { AddressInfo, OrderConfirmItem } from '@/types/model/order'
import { onShow } from '@dcloudio/uni-app'
import { checkLogin } from '@/utils/permission'

const address = ref<AddressInfo | null>(null)
const orderList = ref<OrderConfirmItem[]>([])
const remark = ref('')

onShow(async () => {
  const ok = checkLogin('/pages/order/confirm')
  if (!ok) return

  const [addressRes, orderRes] = await Promise.all([
    getDefaultAddress(),
    getConfirmOrderList(),
  ])

  if (addressRes.code === 0) {
    address.value = addressRes.data
  } else {
    uni.showToast({
      title: addressRes.message || '地址加载失败',
      icon: 'none',
    })
  }

  if (orderRes.code === 0) {
    orderList.value = orderRes.data
  } else {
    uni.showToast({
      title: orderRes.message || '订单商品加载失败',
      icon: 'none',
    })
  }
})

const totalPrice = computed(() => {
  return orderList.value.reduce((sum, item) => {
    return sum + item.price * item.count
  }, 0)
})

function submitOrder() {
  if (!address.value) {
    uni.showToast({
      title: '请先选择收货地址',
      icon: 'none',
    })
    return
  }

  if (orderList.value.length === 0) {
    uni.showToast({
      title: '暂无可提交商品',
      icon: 'none',
    })
    return
  }

  uni.showToast({
    title: '订单已提交',
    icon: 'success',
  })
}
</script>