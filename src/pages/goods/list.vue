<template>
  <view class="min-h-screen bg-background">
    <!-- 搜索框 -->
    <view class="px-4 pt-3">
      <view class="bg-divider rounded-full px-4 py-2 flex items-center justify-between">
        <input
            v-model="keyword"
            class="flex-1 text-[13px] text-text-main"
            placeholder="请输入关键字搜索"
            confirm-type="search"
            @input="handleInput"
            @confirm="handleSearch"
        />
        <view class="text-[16px] text-text-muted ml-2" @click="handleSearch">🔍</view>
      </view>
    </view>

    <!-- 筛选栏 -->
    <view class="bg-card mt-3 px-4 py-3 flex items-center justify-between text-[14px] text-text-main">
      <view class="flex items-center" @click="changeSort('default')">
        <text :class="sortField === 'default' ? 'text-link' : ''">综合</text>
        <text class="ml-1 text-[10px]" v-if="sortField === 'default'">▼</text>
      </view>

      <view class="flex items-center" @click="changeSort('price')">
        <text :class="sortField === 'price' ? 'text-link' : ''">价格</text>
        <view class="ml-1 flex flex-col leading-none text-[8px]">
          <text :class="sortField === 'price' && sortOrder === 'asc' ? 'text-link' : 'text-text-muted'">▲</text>
          <text :class="sortField === 'price' && sortOrder === 'desc' ? 'text-link' : 'text-text-muted'">▼</text>
        </view>
      </view>

      <view class="flex items-center" @click="changeSort('sales')">
        <text :class="sortField === 'sales' ? 'text-link' : ''">销量</text>
        <view class="ml-1 flex flex-col leading-none text-[8px]">
          <text :class="sortField === 'sales' && sortOrder === 'asc' ? 'text-link' : 'text-text-muted'">▲</text>
          <text :class="sortField === 'sales' && sortOrder === 'desc' ? 'text-link' : 'text-text-muted'">▼</text>
        </view>
      </view>

      <view class="flex items-center" @click="toggleFilter">
        <text :class="isFiltered ? 'text-link' : ''">筛选</text>
        <text class="ml-1 text-[10px]" :class="isFiltered ? 'text-link' : ''">▼</text>
      </view>

      <view class="flex items-center" @click="toggleViewMode">
        <text class="text-[18px]">
          {{ isGrid ? '⊞' : '☷' }}
        </text>
      </view>
    </view>

    <!-- 简易筛选面板 (仅在点击筛选时显示) -->
    <view v-if="showFilterPanel" class="bg-card px-4 py-4 border-t border-divider flex flex-col gap-4 animate-fade-in">
      <view>
        <view class="text-[13px] text-text-secondary mb-2">价格区间 (元)</view>
        <view class="flex items-center gap-3">
          <input
              v-model="minPrice"
              type="number"
              class="flex-1 bg-surface-muted rounded-lg h-8 px-3 text-[12px]"
              placeholder="最低价"
          />
          <text class="text-text-muted">-</text>
          <input
              v-model="maxPrice"
              type="number"
              class="flex-1 bg-surface-muted rounded-lg h-8 px-3 text-[12px]"
              placeholder="最高价"
          />
        </view>
      </view>
      <view class="flex gap-3 mt-2">
        <view
            class="flex-1 py-2 text-center text-[13px] border border-border rounded-full active:bg-surface-soft"
            @click="resetFilter"
        >
          重置
        </view>
        <view
            class="flex-1 py-2 text-center text-[13px] bg-cta text-text-inverse rounded-full active:opacity-90"
            @click="applyFilter"
        >
          确定
        </view>
      </view>
    </view>

    <!-- 宫格模式 -->
    <view v-if="isGrid" class="px-4 pt-4 grid grid-cols-2 gap-4">
      <template v-if="loading && page === 1">
        <!-- 骨架屏占位 -->
        <view v-for="i in 6" :key="i" class="bg-card rounded-3xl overflow-hidden shadow-sm animate-pulse">
          <view class="w-full h-[180px] bg-divider"></view>
          <view class="p-3">
            <view class="h-4 bg-divider rounded w-3/4 mb-2"></view>
            <view class="h-3 bg-divider rounded w-1/2 mb-4"></view>
            <view class="flex justify-between items-center">
              <view class="h-5 bg-divider rounded w-1/4"></view>
              <view class="h-6 bg-divider rounded-full w-12"></view>
            </view>
          </view>
        </view>
      </template>
      <ProductCard
          v-for="item in productList"
          :key="item.id"
          :product="item"
          @click="goDetail"
      />
    </view>

    <!-- 列表模式 -->
    <view v-else class="px-4 pt-4 flex flex-col gap-4">
      <template v-if="loading && page === 1">
        <!-- 列表模式骨架屏 -->
        <view v-for="i in 6" :key="i" class="bg-card rounded-2xl p-3 flex gap-3 animate-pulse">
          <view class="w-[100px] h-[100px] bg-divider rounded-xl flex-shrink-0"></view>
          <view class="flex-1 flex flex-col justify-between py-1">
            <view>
              <view class="h-4 bg-divider rounded w-3/4 mb-2"></view>
              <view class="h-3 bg-divider rounded w-1/2"></view>
            </view>
            <view class="flex justify-between items-end">
              <view class="h-5 bg-divider rounded w-1/4"></view>
              <view class="h-7 bg-divider rounded-full w-16"></view>
            </view>
          </view>
        </view>
      </template>

      <view
          v-for="item in productList"
          :key="item.id"
          class="bg-card rounded-2xl p-3 flex gap-3 active:bg-surface-soft transition-colors"
          @click="goDetail(item)"
      >
        <view class="relative flex-shrink-0">
          <image
              :src="item.image"
              class="w-[100px] h-[100px] bg-primary-soft rounded-xl"
              mode="aspectFill"
              lazy-load="true"
              @error="APP_CONFIG.COMMON.IMAGE_PLACEHOLDER"
          />
          <view
              v-if="item.tag"
              class="absolute left-1 top-1 rounded-full bg-tag-brand px-2 py-0.5 text-[10px] text-text-inverse"
          >
            {{ item.tag }}
          </view>
        </view>

        <view class="flex-1 flex flex-col justify-between py-1">
          <view>
            <view class="text-[14px] font-semibold text-text-main leading-5 line-clamp-2">
              {{ item.name }}
            </view>
            <view class="mt-1 text-[12px] text-text-secondary">
              {{ item.subtitle }}
            </view>
          </view>

          <view class="flex items-center justify-between">
            <view class="text-[18px] font-bold text-price">
              ¥{{ item.price }}
            </view>
            <view class="rounded-full bg-warning px-4 py-1.5 text-[12px] text-text-inverse">
              立即购买
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载状态提示 -->
    <view class="py-10 flex justify-center items-center">
      <view v-if="loading" class="text-[12px] text-text-muted flex items-center">
        <view class="w-4 h-4 border-2 border-link border-t-transparent rounded-full animate-spin mr-2"></view>
        正在加载更多...
      </view>
      <view v-else-if="finished" class="text-[12px] text-text-muted">
        — 已经到底啦 —
      </view>
      <view v-else-if="productList.length === 0" class="pt-20 flex flex-col items-center">
        <view class="text-[60px] text-empty-illustration">🍷</view>
        <view class="text-[14px] text-text-muted mt-4">暂无相关商品</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'
import type { ProductItem } from '@/types/model/goods'
import type { GoodsListParams } from '@/types/api/goods'
import ProductCard from '@/components/business/ProductCard.vue'
import { useGoods } from '@/hooks/useGoods'
import APP_CONFIG from "@/config/app";

const sortField = ref<'default' | 'price' | 'sales'>('default')
const sortOrder = ref<'asc' | 'desc'>('desc')
const isGrid = ref(true)
const keyword = ref('')

const { loading, finished, productList, page, getGoodsList } = useGoods()

// 筛选相关
const showFilterPanel = ref(false)
const minPrice = ref<number | undefined>(undefined)
const maxPrice = ref<number | undefined>(undefined)
const isFiltered = computed(() => minPrice.value !== undefined || maxPrice.value !== undefined)

// 保存路由参数
let pageOptions: any = {}
let searchTimer: any = null

function handleInput() {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchProductList(true)
  }, 500)
}

async function fetchProductList(isRefresh = false) {
  if (loading.value || (finished.value && !isRefresh)) return

  const params: GoodsListParams = {
    categoryId: pageOptions.categoryId ? Number(pageOptions.categoryId) : undefined,
    subCategoryId: pageOptions.subCategoryId ? Number(pageOptions.subCategoryId) : undefined,
    keyword: keyword.value,
    sortField: sortField.value,
    sortOrder: sortOrder.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
  }

  try {
    await getGoodsList(params, isRefresh)
  } finally {
    if (isRefresh) uni.stopPullDownRefresh()
  }
}

onLoad(async (options) => {
  pageOptions = options || {}
  if (options && options.title) {
    uni.setNavigationBarTitle({ title: decodeURIComponent(options.title) })
  }
  await fetchProductList(true)
})

// 触底加载更多
onReachBottom(() => {
  fetchProductList()
})

// 下拉刷新
onPullDownRefresh(() => {
  fetchProductList(true)
})

function toggleViewMode() {
  isGrid.value = !isGrid.value
}

function handleSearch() {
  fetchProductList(true)
}

function changeSort(field: 'default' | 'price' | 'sales') {
  if (field === sortField.value) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'desc'
  }
  fetchProductList(true)
}

function toggleFilter() {
  showFilterPanel.value = !showFilterPanel.value
}

function resetFilter() {
  minPrice.value = undefined
  maxPrice.value = undefined
  showFilterPanel.value = false
  fetchProductList(true)
}

function applyFilter() {
  showFilterPanel.value = false
  fetchProductList(true)
}

function goDetail(item: ProductItem) {
  uni.navigateTo({
    url: `/pages/goods/detail?id=${item.id}`,
  })
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
