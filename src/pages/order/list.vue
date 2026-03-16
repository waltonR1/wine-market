<template>
  <view class="min-h-screen bg-[#F8F8F8] pb-6">
    <!-- 状态切换栏 -->
    <view class="sticky top-0 z-[90] bg-white flex items-center justify-around h-[44px] border-b border-[#F0F0F0]">
      <view
          v-for="tab in tabs"
          :key="tab.status"
          class="h-full flex items-center px-2 relative text-[14px]"
          :class="activeStatus === tab.status ? 'text-[#C40000] font-medium' : 'text-[#666]'"
          @click="changeTab(tab.status)"
      >
        {{ tab.label }}
        <view
            v-if="activeStatus === tab.status"
            class="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C40000] rounded-full"
        ></view>
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="p-4">
      <template v-if="orderList.length > 0">
        <OrderCard
            v-for="order in orderList"
            :key="order.id"
            :order="order"
            @action="handleOrderAction"
        />
      </template>

      <!-- 空状态 -->
      <view v-else class="flex flex-col items-center pt-20">
        <view class="text-[60px] mb-4 opacity-20">📦</view>
        <view class="text-[14px] text-[#999]">暂无相关订单</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import OrderCard from '@/components/business/OrderCard.vue'
import type { OrderItem } from '@/types/model/order'
import { useOrder } from '@/hooks/useOrder'

const activeStatus = ref(0)
const { orderList, fetchOrderList } = useOrder()

const tabs = [
  { label: '全部', status: 0 },
  { label: '待付款', status: 1 },
  { label: '待发货', status: 2 },
  { label: '待收货', status: 3 },
  { label: '待评价', status: 4 },
]

const fetchList = async () => {
  await fetchOrderList(activeStatus.value)
}

onLoad((options) => {
  if (options?.status != null) {
    activeStatus.value = Number(options.status)
  }
})

onShow(() => {
  fetchList()
})

const changeTab = (status: number) => {
  activeStatus.value = status
  fetchList()
}

const handleOrderAction = (type: string, order: OrderItem) => {
  uni.showToast({
    title: `操作: ${type} 订单: ${order.orderNum}`,
    icon: 'none'
  })
}
</script>

<style scoped>
page {
  background-color: #F8F8F8;
}
</style>
