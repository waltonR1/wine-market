<template>
  <view class="min-h-screen bg-[#F5F5F5]">
    <!-- 搜索框 -->
    <view class="px-4 pt-3">
      <view class="bg-[#EEEEEE] rounded-full px-4 py-3 flex items-center justify-between">
        <view class="text-[13px] text-[#999999]">
          请输入关键字搜索
        </view>
        <view class="text-[16px] text-[#999999]">🔍</view>
      </view>
    </view>

    <!-- 筛选栏 -->
    <view class="bg-white mt-3 px-4 py-3 flex items-center justify-between text-[14px] text-[#333]">
      <view class="flex items-center" @click="changeSort('default')">
        <text :class="sortType === 'default' ? 'text-[#C40000]' : ''">综合</text>
        <text class="ml-1 text-[10px]">▼</text>
      </view>

      <view class="flex items-center" @click="changeSort('price')">
        <text :class="sortType === 'price' ? 'text-[#C40000]' : ''">价格</text>
        <view class="ml-1 flex flex-col leading-none text-[8px] text-[#999]">
          <text>▲</text>
          <text>▼</text>
        </view>
      </view>

      <view class="flex items-center" @click="changeSort('sales')">
        <text :class="sortType === 'sales' ? 'text-[#C40000]' : ''">销量</text>
        <view class="ml-1 flex flex-col leading-none text-[8px] text-[#999]">
          <text>▲</text>
          <text>▼</text>
        </view>
      </view>

      <view class="flex items-center" @click="toggleViewMode">
        <text class="text-[15px]">
          {{ isGrid ? '⊞' : '☷' }}
        </text>
      </view>

      <view class="flex items-center">
        <text>筛选</text>
        <text class="ml-1 text-[10px]">▼</text>
      </view>
    </view>

    <!-- 宫格模式 -->
    <view v-if="isGrid" class="px-4 pt-4 grid grid-cols-2 gap-x-3 gap-y-5">
      <view
          v-for="item in productList"
          :key="item.id"
          class="bg-white"
          @click="goDetail(item)"
      >
        <image
            :src="item.image"
            class="w-full h-[180px] bg-[#EFE7DE]"
            mode="aspectFill"
        />

        <view class="pt-2">
          <view class="text-[13px] text-[#222] leading-5 line-clamp-2 min-h-[40px]">
            {{ item.name }}
          </view>

          <view class="mt-2 flex items-center justify-between">
            <view class="text-[#D60000] text-[16px] font-medium">
              ¥ {{ item.price.toFixed(2) }}
            </view>

            <view class="text-[#B3B3B3] text-[18px]">
              🛒
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 列表模式 -->
    <view v-else class="px-4 pt-4">
      <view
          v-for="item in productList"
          :key="item.id"
          class="bg-white mb-4 flex"
          @click="goDetail(item)"
      >
        <image
            :src="item.image"
            class="w-[140px] h-[110px] bg-[#EFE7DE]"
            mode="aspectFill"
        />

        <view class="flex-1 px-3 py-2 flex flex-col justify-between">
          <view>
            <view class="text-[14px] text-[#222] leading-5 line-clamp-2">
              {{ item.name }}
            </view>

            <view class="text-[12px] text-[#999] mt-2">
              {{ item.comment }}条评论
            </view>
          </view>

          <view class="flex items-center justify-between">
            <view class="text-[#D60000] text-[18px] font-medium">
              ¥ {{ item.price.toFixed(2) }}
            </view>

            <view class="text-[#B3B3B3] text-[18px]">
              🛒
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getGoodsList } from '@/api'
import type { ProductItem } from '@/types/model/goods'

const sortType = ref<'default' | 'price' | 'sales'>('default')
const isGrid = ref(true)
const productList = ref<ProductItem[]>([])

onMounted(async () => {
  const res = await getGoodsList()

  if (res.code === 0) {
    productList.value = res.data
  } else {
    await uni.showToast({
      title: res.message || '商品加载失败',
      icon: 'none',
    })
  }
})

function toggleViewMode() {
  isGrid.value = !isGrid.value
}

function changeSort(type: 'default' | 'price' | 'sales') {
  sortType.value = type
}

function goDetail(item: ProductItem) {
  uni.navigateTo({
    url: `/pages/goods/detail?id=${item.id}`,
  })
}
</script>