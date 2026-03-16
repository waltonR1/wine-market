<template>
  <view class="min-h-screen bg-background pb-8">
    <!-- 顶部品牌区 -->
    <view class="px-4 pt-4">
      <view class="rounded-3xl bg-primary px-5 py-6 text-white shadow-lg">
        <view class="text-[24px] font-bold tracking-wide">
          Wine Market
        </view>
        <view class="mt-2 text-[13px] text-border leading-5">
          精选红酒 · 白葡萄酒 · 香槟 · 烈酒
        </view>

        <view class="mt-5 rounded-2xl bg-accent px-4 py-4">
          <view class="text-[18px] font-semibold text-secondary">
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
        <view class="text-[20px] font-bold text-text-main">
          精选推荐
        </view>
        <view class="text-[12px] text-text-secondary mt-1">
          Boutique Selection
        </view>
      </view>
      <view class="text-[13px] text-accent font-medium">
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
import { onMounted, ref } from 'vue'
import ProductCard from '@/components/business/ProductCard.vue'
import { getHomeCategoryList, getHomeProductList } from '@/api'
import type { ProductItem } from '@/types/model/goods'

interface HomeCategoryItem {
  id: number
  name: string
  icon: string
}

const categories = ref<HomeCategoryItem[]>([])
const productList = ref<ProductItem[]>([])

onMounted(async () => {
  const [categoryRes, productRes] = await Promise.all([
    getHomeCategoryList(),
    getHomeProductList(),
  ])

  if (categoryRes.code === 0) {
    categories.value = categoryRes.data
  } else {
    await uni.showToast({
      title: categoryRes.message || '分类加载失败',
      icon: 'none',
    })
  }

  if (productRes.code === 0) {
    productList.value = productRes.data
  } else {
    await uni.showToast({
      title: productRes.message || '商品加载失败',
      icon: 'none',
    })
  }
})

function goDetail(item: ProductItem) {
  uni.navigateTo({
    url: `/pages/goods/detail?id=${item.id}`,
  })
}
</script>