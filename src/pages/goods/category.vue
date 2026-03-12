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
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const activeFirstId = ref(1)

const firstCategoryList = [
  { id: 1, name: '干红' },
  { id: 2, name: '礼盒' },
  { id: 3, name: '干白' },
  { id: 4, name: '甜白' },
  { id: 5, name: '烈酒' },
  { id: 6, name: '无醇' },
  { id: 7, name: '世界名庄' },
  { id: 8, name: '促销活动' },
  { id: 9, name: '香槟 起泡酒' }
]

const secondCategoryMap = {
  1: [
    { id: 101, name: '所有干红', image: '/static/logo.png' },
    { id: 102, name: '波尔多产区', image: '/static/logo.png' },
    { id: 103, name: '罗纳河谷', image: '/static/logo.png' },
    { id: 104, name: '其他产区', image: '/static/logo.png' },
    { id: 105, name: '勃艮第', image: '/static/logo.png' }
  ],
  2: [
    { id: 201, name: '节日礼盒', image: '/static/logo.png' },
    { id: 202, name: '商务送礼', image: '/static/logo.png' },
    { id: 203, name: '双支礼盒', image: '/static/logo.png' }
  ],
  3: [
    { id: 301, name: '所有干白', image: '/static/logo.png' },
    { id: 302, name: '霞多丽', image: '/static/logo.png' },
    { id: 303, name: '长相思', image: '/static/logo.png' }
  ],
  4: [
    { id: 401, name: '贵腐', image: '/static/logo.png' },
    { id: 402, name: '晚收甜白', image: '/static/logo.png' }
  ],
  5: [
    { id: 501, name: '威士忌', image: '/static/logo.png' },
    { id: 502, name: '白兰地', image: '/static/logo.png' },
    { id: 503, name: 'XO', image: '/static/logo.png' }
  ],
  6: [
    { id: 601, name: '无醇红', image: '/static/logo.png' },
    { id: 602, name: '无醇起泡', image: '/static/logo.png' }
  ],
  7: [
    { id: 701, name: '波尔多名庄', image: '/static/logo.png' },
    { id: 702, name: '勃艮第名庄', image: '/static/logo.png' }
  ],
  8: [
    { id: 801, name: '限时折扣', image: '/static/logo.png' },
    { id: 802, name: '买赠专区', image: '/static/logo.png' }
  ],
  9: [
    { id: 901, name: '香槟', image: '/static/logo.png' },
    { id: 902, name: '起泡酒', image: '/static/logo.png' }
  ]
} as Record<number, { id: number; name: string; image: string }[]>

const currentSecondList = computed(() => {
  return secondCategoryMap[activeFirstId.value] || []
})

function changeFirst(id: number) {
  activeFirstId.value = id
}

function goList(item: { id: number; name: string }) {
  uni.navigateTo({
    url: `/pages/goods/list?secondId=${item.id}&title=${encodeURIComponent(item.name)}`
  })
}
</script>