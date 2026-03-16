<template>
  <view class="h-screen bg-white flex overflow-hidden">
    <!-- 左侧一级分类 -->
    <view class="w-[90px] bg-[#F5F5F5] h-full overflow-y-auto">
      <view
          v-for="item in firstCategoryList"
          :key="item.id"
          class="px-3 py-5 text-[14px] text-center relative"
          :class="activeFirstId === item.id ? 'bg-white text-accent font-medium' : 'text-[#555]'"
          @click="changeFirst(item.id)"
      >
        <view
            v-if="activeFirstId === item.id"
            class="absolute left-0 top-0 bottom-0 w-[3px] bg-accent"
        ></view>
        {{ item.name }}
      </view>
    </view>

    <!-- 右侧二级分类 -->
    <view class="flex-1 bg-white px-4 pt-4 overflow-y-auto">
      <view class="grid grid-cols-3 gap-x-4 gap-y-6">
        <view
            v-for="item in currentSecondList"
            :key="item.id"
            class="flex flex-col items-center"
            @click="goList(item)"
        >
          <image
              :src="item.image"
              class="w-[72px] h-[72px] rounded-full bg-background"
              mode="aspectFill"
          />
          <view class="mt-2 text-[13px] text-[#333] text-center leading-4">
            {{ item.name }}
          </view>
        </view>
      </view>

      <view
          v-if="currentSecondList.length === 0"
          class="text-center text-[14px] text-text-secondary py-10"
      >
        暂无分类数据
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import type { SecondCategoryItem } from '@/types/model/goods'
import { useGoodsCategory } from '@/hooks/useGoodsCategory'

const {
  activeFirstId,
  firstCategoryList,
  currentSecondList,
  fetchCategories,
  changeFirst,
} = useGoodsCategory()

onMounted(() => {
  fetchCategories()
})

function goList(item: SecondCategoryItem) {
  uni.navigateTo({
    url: `/pages/goods/list?categoryId=${activeFirstId.value}&subCategoryId=${item.id}&title=${encodeURIComponent(item.name)}`,
  })
}
</script>
