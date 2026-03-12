<template>
  <view class="min-h-screen bg-[#F7F3EE] pb-[100px]">

    <!-- 商品图片 -->
    <image
        :src="product.image"
        class="w-full h-[320px] bg-[#EFE7DE]"
        mode="aspectFill"
    />

    <!-- 商品信息 -->
    <view class="bg-white rounded-t-3xl -mt-6 p-5">

      <!-- 酒名 -->
      <view class="text-[20px] font-bold text-[#2C2C2C] leading-6">
        {{ product.name }}
      </view>

      <!-- 副标题 -->
      <view class="mt-2 text-[13px] text-[#8B7B6B]">
        {{ product.subtitle }}
      </view>

      <!-- 价格 -->
      <view class="mt-4 text-[26px] font-bold text-[#6B0F1A]">
        ¥{{ product.price }}
      </view>

      <!-- 分割线 -->
      <view class="h-[1px] bg-[#EEE] my-5"></view>

      <!-- 酒类信息 -->
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

      <!-- 商品介绍 -->
      <view class="mt-6">

        <view class="text-[16px] font-bold text-[#2C2C2C]">
          酒品介绍
        </view>

        <view class="mt-3 text-[13px] text-[#6F6258] leading-6">
          {{ product.description }}
        </view>

      </view>

    </view>

    <!-- 底部购买栏 -->
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
</template>

<script setup lang="ts">

const product = {
  id: 1,
  name: 'Château Bordeaux Rouge',
  subtitle: '法国波尔多干红',
  price: 199,
  region: '波尔多',
  type: '红葡萄酒',
  alcohol: '13.5%',
  image: '/static/logo.png',
  description:
      '来自法国波尔多经典产区，采用传统酿造工艺，单宁柔和，带有黑莓与橡木香气，非常适合搭配牛排与奶酪。'
}

function addCart() {
  uni.showToast({
    title: '已加入购物车',
    icon: 'success'
  })
}

</script>