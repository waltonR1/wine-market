<template>
  <view class="min-h-screen bg-[#F8F8F8] pb-6">
    <view class="sticky top-0 z-[90] flex h-[44px] items-center justify-around border-b border-[#F0F0F0] bg-white">
      <view
        v-for="tab in tabs"
        :key="tab.status"
        class="relative flex h-full items-center px-2 text-[14px]"
        :class="activeStatus === tab.status ? 'font-medium text-[#C40000]' : 'text-[#666]'"
        @click="changeTab(tab.status)"
      >
        {{ tab.label }}
        <view
          v-if="activeStatus === tab.status"
          class="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#C40000]"
        ></view>
      </view>
    </view>

    <view class="p-4">
      <template v-if="orderList.length > 0">
        <OrderCard
          v-for="order in orderList"
          :key="order.id"
          :order="order"
          @action="handleOrderAction"
          @click="goOrderDetail"
        />
      </template>

      <view v-else class="flex flex-col items-center pt-20">
        <view class="mb-4 text-[60px] opacity-20">📦</view>
        <view class="text-[14px] text-[#999]">暂无相关订单</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import OrderCard from '@/components/business/OrderCard.vue'
import type { OrderAction, OrderItem } from '@/types/model/order'
import { useOrder } from '@/hooks/useOrder'

const activeStatus = ref(0)
const {
  orderList,
  actionLoading,
  fetchOrderList,
  cancelOrder,
  confirmReceiveOrder,
  deleteOrder,
  rebuyOrder,
} = useOrder()

const tabs = [
  { label: '全部', status: 0 },
  { label: '待付款', status: 1 },
  { label: '待发货', status: 2 },
  { label: '待收货', status: 3 },
  { label: '待评价', status: 4 },
  { label: '已关闭', status: 6 },
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

function changeTab(status: number) {
  activeStatus.value = status
  fetchList()
}

async function showConfirmModal(content: string) {
  const res = await new Promise<UniApp.ShowModalRes>((resolve) => {
    uni.showModal({
      title: '提示',
      content,
      success: resolve,
      fail: () => resolve({ confirm: false, cancel: true, errMsg: 'showModal:fail' }),
    })
  })

  return res.confirm
}

async function handleCancelOrder(order: OrderItem) {
  if (actionLoading.value) return
  const confirmed = await showConfirmModal(`确定取消订单 ${order.orderNum} 吗？`)
  if (!confirmed) return

  const ok = await cancelOrder(order.id)
  if (!ok) return

  uni.showToast({ title: '订单已关闭', icon: 'success' })
  fetchList()
}

async function handleConfirmOrder(order: OrderItem) {
  if (actionLoading.value) return
  const confirmed = await showConfirmModal('确认已收到商品？')
  if (!confirmed) return

  const ok = await confirmReceiveOrder(order.id)
  if (!ok) return

  uni.showToast({ title: '已确认收货', icon: 'success' })
  fetchList()
}

async function handleDeleteOrder(order: OrderItem) {
  if (actionLoading.value) return
  const confirmed = await showConfirmModal(`确定删除订单 ${order.orderNum} 吗？`)
  if (!confirmed) return

  const ok = await deleteOrder(order.id)
  if (!ok) return

  uni.showToast({ title: '订单已删除', icon: 'success' })
}

function handlePayOrder(order: OrderItem) {
  uni.navigateTo({
    url: `/pages/order/pay?id=${order.id}`,
  })
}

function handleCommentOrder(order: OrderItem) {
  uni.navigateTo({
    url: `/pages/order/comment?id=${order.id}`,
  })
}

async function handleRebuyOrder(order: OrderItem) {
  if (actionLoading.value) return
  const ok = await rebuyOrder(order.id)
  if (!ok) return

  uni.showToast({ title: '已同步到购物车', icon: 'success' })
  setTimeout(() => {
    uni.switchTab({
      url: '/pages/cart/index',
    })
  }, 300)
}

function handleAfterSale(order: OrderItem) {
  uni.navigateTo({
    url: `/pages/order/aftersale?id=${order.id}`,
  })
}

const handleOrderAction = async (type: OrderAction, order: OrderItem) => {
  if (actionLoading.value && type !== 'pay' && type !== 'comment' && type !== 'aftersale') return

  switch (type) {
    case 'cancel':
      await handleCancelOrder(order)
      break
    case 'pay':
      handlePayOrder(order)
      break
    case 'confirm':
      await handleConfirmOrder(order)
      break
    case 'comment':
      handleCommentOrder(order)
      break
    case 'delete':
      await handleDeleteOrder(order)
      break
    case 'rebuy':
      await handleRebuyOrder(order)
      break
    case 'aftersale':
      handleAfterSale(order)
      break
    default:
      break
  }
}

function goOrderDetail(order: OrderItem) {
  uni.navigateTo({
    url: `/pages/order/detail?id=${order.id}`,
  })
}
</script>

<style scoped>
page {
  background-color: #f8f8f8;
}
</style>
