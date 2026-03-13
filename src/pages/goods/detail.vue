<template>
  <view
      v-if="product"
      class="min-h-screen bg-[#F7F3EE] pb-[100px]"
  >
    <image
        :src="product.image"
        class="w-full h-[320px] bg-[#EFE7DE]"
        mode="aspectFill"
    />

    <view class="bg-white rounded-t-3xl -mt-6 p-5">
      <view class="text-[20px] font-bold text-[#2C2C2C] leading-6">
        {{ product.name }}
      </view>

      <view class="mt-2 text-[13px] text-[#8B7B6B]">
        {{ product.subtitle }}
      </view>

      <view class="mt-4 text-[26px] font-bold text-[#6B0F1A]">
        ¥{{ product.price }}
      </view>

      <view class="h-[1px] bg-[#EEE] my-5"></view>

      <view class="grid grid-cols-3 gap-3 text-center">
        <view class="bg-[#F8F5F2] rounded-xl py-3">
          <view class="text-[11px] text-[#8B7B6B]">
            产区
          </view>
          <view class="mt-1 text-[13px] font-medium text-[#2C2C2C]">
            {{ product.region }}
          </view>
        </view>

        <view class="bg-[#F8F5F2] rounded-xl py-3">
          <view class="text-[11px] text-[#8B7B6B]">
            类型
          </view>
          <view class="mt-1 text-[13px] font-medium text-[#2C2C2C]">
            {{ product.type }}
          </view>
        </view>

        <view class="bg-[#F8F5F2] rounded-xl py-3">
          <view class="text-[11px] text-[#8B7B6B]">
            酒精度
          </view>
          <view class="mt-1 text-[13px] font-medium text-[#2C2C2C]">
            {{ product.alcohol }}
          </view>
        </view>
      </view>

      <view class="mt-6">
        <view class="text-[16px] font-bold text-[#2C2C2C]">
          酒品介绍
        </view>

        <view class="mt-3 text-[13px] text-[#6F6258] leading-6">
          {{ product.description }}
        </view>
      </view>
    </view>

    <view
        class="fixed bottom-0 left-0 right-0 bg-white border-t border-[#eee] px-4 py-3 flex items-center justify-between"
    >
      <view class="text-[20px] font-bold text-[#6B0F1A]">
        ¥{{ product.price }}
      </view>

      <view class="flex gap-3">
        <view
            class="px-4 py-2 rounded-full border border-[#6B0F1A] text-[#6B0F1A] text-[13px]"
            @click="addCart"
        >
          加入购物车
        </view>

        <view
            class="px-5 py-2 rounded-full bg-[#6B0F1A] text-white text-[13px]"
        >
          立即购买
        </view>
      </view>
    </view>
  </view>

  <view
      v-else
      class="min-h-screen flex items-center justify-center text-[#8B7B6B]"
  >
    商品加载中...
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getGoodsDetail } from '@/api'
import type { ProductDetail } from '@/types/model/goods'

const product = ref<ProductDetail | null>(null)

onLoad(async (options) => {
  const id = Number(options?.id)

  if (Number.isNaN(id)) {
    await uni.showToast({
      title: '商品参数错误',
      icon: 'none',
    })
    return
  }

  const res = await getGoodsDetail(id)

  if (res.code === 0 && res.data) {
    product.value = res.data
  } else {
    await uni.showToast({
      title: res.message || '商品不存在',
      icon: 'none',
    })
  }
})

function addCart() {
  if (!product.value) return

  uni.showToast({
    title: '已加入购物车',
    icon: 'success',
  })
}
</script>