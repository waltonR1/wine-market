<template>
  <view class="h-screen bg-white flex overflow-hidden">
    <!-- 左侧一级分类 -->
    <view class="w-[90px] bg-[#F5F5F5] h-full overflow-y-auto">
      <view
          v-for="item in firstCategoryList"
          :key="item.id"
          class="px-3 py-5 text-[14px] text-center relative"
          :class="activeFirstId === item.id ? 'bg-white text-[#6B0F1A] font-medium' : 'text-[#555]'"
          @click="changeFirst(item.id)"
      >
        <view
            v-if="activeFirstId === item.id"
            class="absolute left-0 top-0 bottom-0 w-[3px] bg-[#6B0F1A]"
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
              class="w-[72px] h-[72px] rounded-full bg-[#F7F3EE]"
              mode="aspectFill"
          />
          <view class="mt-2 text-[13px] text-[#333] text-center leading-4">
            {{ item.name }}
          </view>
        </view>
      </view>

      <view
          v-if="currentSecondList.length === 0"
          class="text-center text-[14px] text-[#8B7B6B] py-10"
      >
        暂无分类数据
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getFirstCategoryList, getSecondCategoryMap } from '@/api'
import type { FirstCategoryItem, SecondCategoryItem } from '@/types/model/goods'

const activeFirstId = ref(1)
const firstCategoryList = ref<FirstCategoryItem[]>([])
const secondCategoryMap = ref<Record<number, SecondCategoryItem[]>>({})

const currentSecondList = computed(() => {
  return secondCategoryMap.value[activeFirstId.value] || []
})

onMounted(async () => {
  const [firstRes, secondRes] = await Promise.all([
    getFirstCategoryList(),
    getSecondCategoryMap(),
  ])

  if (firstRes.code === 0) {
    firstCategoryList.value = firstRes.data

    if (firstCategoryList.value.length > 0) {
      activeFirstId.value = firstCategoryList.value[0].id
    }
  } else {
    await uni.showToast({
      title: firstRes.message || '一级分类加载失败',
      icon: 'none',
    })
  }

  if (secondRes.code === 0) {
    secondCategoryMap.value = secondRes.data
  } else {
    await uni.showToast({
      title: secondRes.message || '二级分类加载失败',
      icon: 'none',
    })
  }
})

function changeFirst(id: number) {
  activeFirstId.value = id
}

function goList(item: SecondCategoryItem) {
  uni.navigateTo({
    url: `/pages/goods/list?categoryId=${activeFirstId.value}&subCategoryId=${item.id}&title=${encodeURIComponent(item.name)}`,
  })
}
</script>