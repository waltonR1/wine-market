<template>
  <view class="min-h-screen bg-[#F7F3EE] pb-8">
    <!-- 顶部品牌区 -->
    <view class="px-4 pt-4">
      <view class="rounded-3xl bg-[#4A0D12] px-5 py-6 text-white shadow-lg">
        <view class="text-[24px] font-bold tracking-wide">
          Wine Market
        </view>
        <view class="mt-2 text-[13px] text-[#E7D9C7] leading-5">
          精选红酒 · 白葡萄酒 · 香槟 · 烈酒
        </view>

        <view class="mt-5 rounded-2xl bg-[#6B0F1A] px-4 py-4">
          <view class="text-[18px] font-semibold text-[#F8E7C8]">
            今日推荐
          </view>
          <view class="mt-1 text-[13px] text-[#F5EBDD]">
            为你挑选适合聚会、送礼与日常佐餐的酒款
          </view>
        </view>
      </view>
    </view>

    <!-- 分类区 -->
    <view class="px-4 mt-5">
      <view class="grid grid-cols-4 gap-3">
        <view
            v-for="item in categories"
            :key="item.id"
            class="rounded-2xl bg-white py-4 flex flex-col items-center justify-center shadow-sm"
        >
          <view class="text-[22px]">
            {{ item.icon }}
          </view>
          <view class="mt-2 text-[12px] text-[#4B3A2F]">
            {{ item.name }}
          </view>
        </view>
      </view>
    </view>

    <!-- 标题 -->
    <view class="px-4 mt-6 flex items-center justify-between">
      <view>
        <view class="text-[20px] font-bold text-[#2C2C2C]">
          精选推荐
        </view>
        <view class="text-[12px] text-[#8B7B6B] mt-1">
          Boutique Selection
        </view>
      </view>
      <view class="text-[13px] text-[#6B0F1A] font-medium">
        查看全部
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="px-4 mt-4 grid grid-cols-2 gap-4">
      <ProductCard
          v-for="item in productList"
          :key="item.id"
          :product="item"
          @click="goDetail"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import ProductCard from '@/components/business/ProductCard.vue'

const categories = [
  { id: 1, name: '红酒', icon: '🍷' },
  { id: 2, name: '白葡萄酒', icon: '🥂' },
  { id: 3, name: '香槟', icon: '🍾' },
  { id: 4, name: '烈酒', icon: '🥃' },
]

const productList = [
  {
    id: 1,
    name: 'Château Bordeaux Rouge',
    subtitle: '法国波尔多干红',
    price: 199,
    image: '/static/logo.png',
    tag: '精选'
  },
  {
    id: 2,
    name: 'Champagne Brut Réserve',
    subtitle: '香槟区起泡酒',
    price: 399,
    image: '/static/logo.png',
    tag: '热门'
  },
  {
    id: 3,
    name: 'Bourgogne Chardonnay',
    subtitle: '勃艮第霞多丽',
    price: 268,
    image: '/static/logo.png',
    tag: '白葡萄酒'
  },
  {
    id: 4,
    name: 'Single Malt Whisky',
    subtitle: '单一麦芽威士忌',
    price: 528,
    image: '/static/logo.png',
    tag: '烈酒'
  }
]

function goDetail(item: any) {
  uni.navigateTo({
    url: `/pages/goods/detail?id=${item.id}`
  })
}
</script>