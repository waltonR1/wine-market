<template>
  <view class="min-h-screen bg-background pb-[120px]">
    <!-- 收货地址 -->
    <view
      class="bg-card px-4 py-4 flex items-center justify-between"
      @click="goSelectAddress"
    >
      <view v-if="address">
        <view class="text-[14px] font-medium text-text-main">
          {{ address.name }} {{ address.phone }}
        </view>

        <view class="text-[12px] text-text-secondary mt-1">
          {{ formatAddress(address) }}
        </view>
      </view>

      <view v-else class="text-[13px] text-text-muted">
        暂无收货地址
      </view>

      <view class="text-text-muted">
        >
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="bg-card mt-3">
      <view
          v-for="item in orderList"
          :key="item.id"
          class="flex px-4 py-4 border-b border-divider"
      >
        <image
            :src="item.image"
            class="w-[90px] h-[90px] bg-primary-soft"
            mode="aspectFill"
        />

        <view class="flex-1 ml-3 flex flex-col justify-between">
          <view class="text-[14px] text-text-main leading-5">
            {{ item.name }}
          </view>

          <view class="text-[12px] text-text-secondary">
            {{ item.spec }}
          </view>

          <view class="flex items-center justify-between">
            <view class="text-price text-[16px] font-medium">
              ¥{{ item.price }}
            </view>

            <view class="text-[13px] text-text-secondary">
              ×{{ item.count }}
            </view>
          </view>
        </view>
      </view>

      <view
          v-if="orderList.length === 0"
          class="text-center text-[14px] text-text-secondary py-10"
      >
        暂无确认订单商品
      </view>
    </view>

    <!-- 配送方式 -->
    <view class="bg-card mt-3 px-4 py-4 flex justify-between">
      <view class="text-[14px] text-text-main">
        配送方式
      </view>

      <view class="text-[13px] text-text-secondary">
        快递配送
      </view>
    </view>

    <!-- 订单备注 -->
    <view class="bg-card mt-3 px-4 py-4">
      <view class="text-[14px] text-text-main">
        订单备注
      </view>

      <input
          v-model="remark"
          placeholder="选填：给商家留言"
          class="mt-3 bg-surface-muted rounded-lg px-3 py-2 text-[13px]"
      />
    </view>

    <!-- 费用 -->
    <view class="bg-card mt-3 px-4 py-4">
      <view class="flex justify-between text-[13px] text-text-secondary">
        <view>商品金额</view>
        <view>¥{{ totalPrice.toFixed(2) }}</view>
      </view>

      <view class="flex justify-between text-[13px] text-text-secondary mt-2">
        <view>运费</view>
        <view>¥0.00</view>
      </view>
    </view>
  </view>

  <!-- 底部提交 -->
  <view class="fixed bottom-0 left-0 right-0 bg-card border-t border-divider px-4 py-3 flex items-center justify-between">
    <view class="text-[14px]">
      合计：
      <text class="text-price text-[18px] font-bold">
        ¥{{ totalPrice.toFixed(2) }}
      </text>
    </view>

    <view
        class="bg-cta text-text-inverse px-6 py-2 rounded-full text-[14px]"
        @click="submitOrder"
    >
      提交订单
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {onLoad, onShow} from '@dcloudio/uni-app'
import { checkLogin } from '@/utils/permission'
import { useOrder } from '@/hooks/useOrder'
import {formatAddress} from "@/utils/format";

const remark = ref('')

const {
  defaultAddress: address,
  confirmOrderList: orderList,
  fetchDefaultAddress,
  fetchConfirmOrderList,
  submitOrder: submitOrderApi,
} = useOrder()

const pageFrom = ref<'cart' | 'buyNow'>('buyNow')

onLoad((options) => {
  if (options?.from === 'cart') {
    pageFrom.value = 'cart'
  }
})

onShow(async () => {
  const ok = checkLogin('/pages/order/confirm')
  if (!ok) return

  await Promise.all([fetchDefaultAddress(), fetchConfirmOrderList()])
})

const totalPrice = computed(() => {
  return orderList.value.reduce((sum, item) => {
    return sum + item.price * item.count
  }, 0)
})

function goSelectAddress() {
  uni.navigateTo({
    url: '/pages/member/address?select=1',
  })
}

async function submitOrder() {
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

  for (const item of orderList.value) {
    if (item.count > item.stock) {
      uni.showToast({
        title: `${item.name} 库存不足`,
        icon: 'none',
      })
      return
    }
  }

  const order = await submitOrderApi({
    goods: orderList.value,
    address: address.value,
    remark: remark.value.trim(),
    from: pageFrom.value,
  })

  if (!order) return

  uni.showToast({
    title: '订单已提交',
    icon: 'success',
  })

  setTimeout(() => {
    uni.redirectTo({
      url: '/pages/order/list?status=1',
    })
  }, 300)
}
</script>
