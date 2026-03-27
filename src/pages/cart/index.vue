<template>
  <view class="min-h-screen bg-background pb-[120px]">
    <!-- 顶部店铺栏 -->
    <view class="bg-white px-4 py-4 flex items-center justify-between border-b border-[#eee]">
      <view class="flex items-center">
        <view class="text-[16px] mr-2">🏪</view>
        <view class="text-[15px] font-medium text-text-main">
          {{ APP_CONFIG.APP_INFO.APP_NAME }}
        </view>
      </view>

      <view
          class="text-[14px] text-accent"
          @click="isEdit = !isEdit"
      >
        {{ isEdit ? '完成' : '编辑' }}
      </view>
    </view>

    <!-- 游客提示 -->
    <view
        v-if="!isLogin"
        class="mx-3 mt-3 bg-[#FFF7E8] text-[#8B6B2E] text-[12px] px-3 py-2 rounded-xl"
    >
      当前为游客购物车，登录后可同步购物车并继续结算
    </view>

    <!-- 商品列表 -->
    <view class="px-3 pt-3">
      <view
          v-if="cartList.length > 0"
          v-for="item in cartList"
          :key="item.id"
          class="bg-white rounded-2xl p-3 mb-3 flex items-center"
      >
        <!-- 选择框 -->
        <view
          class="w-[22px] h-[22px] rounded-full border flex items-center justify-center mr-3"
          :class="getCheckClass(item)"
          @click="handleToggleChecked(item)"
        >
          <view
              v-if="item.checked"
              class="w-[8px] h-[8px] rounded-full bg-white"
          />
        </view>

        <!-- 图片 -->
        <image
            :src="item.image"
            class="w-[84px] h-[84px] rounded-xl bg-[#EFE7DE] mr-3"
            mode="aspectFill"
        />

        <!-- 右侧信息 -->
        <view class="flex-1 min-w-0">
          <view class="flex items-start justify-between gap-2">
            <view class="flex-1 min-w-0">
              <view class="text-[14px] text-text-main leading-5 font-medium line-clamp-2">
                {{ item.name }}
              </view>
              <view class="text-[12px] text-text-secondary mt-2">
                快递
              </view>
              <view class="text-[12px] text-text-secondary mt-1">
                库存：{{ item.stock }}
              </view>
            </view>

            <view class="text-[18px] font-bold text-accent whitespace-nowrap">
              ¥ {{ item.price.toFixed(2) }}
            </view>
          </view>

          <view class="mt-3 flex items-center justify-end">
            <template v-if="!isOutOfStock(item)">
              <view class="flex items-center">
                <view
                  class="w-[28px] h-[28px] rounded-full bg-[#F5F1EC] flex items-center justify-center text-accent text-[16px]"
                  @click="decreaseCount(item.id)"
                >
                  −
                </view>

                <view class="mx-3 text-[14px] text-text-main min-w-[14px] text-center">
                  {{ item.count }}
                </view>

                <view
                  class="w-[28px] h-[28px] rounded-full bg-[#F5F1EC] flex items-center justify-center text-accent text-[16px]"
                  @click="increaseCount(item.id)"
                >
                  +
                </view>
              </view>
            </template>

            <view
              v-else
              class="text-[12px] text-[#C40000] bg-[#FFF1F0] px-3 py-1 rounded-full"
            >
              库存不足
            </view>

          </view>
        </view>
      </view>

      <Empty
          v-if="cartList.length === 0"
          icon="🛒"
          message="购物车空空的，快去选购吧"
          button-text="去选购商品"
          show-button
          @click="goCategory"
      />
    </view>

    <!-- 底部栏 -->
    <view
        class="fixed bottom-0 left-0 right-0 bg-white border-t border-[#eee] px-4 py-3 flex items-center justify-between"
    >
      <view class="flex items-center" @click="handleToggleAllChecked">
        <view
            class="w-[22px] h-[22px] rounded-full border flex items-center justify-center mr-2"
            :class="displayAllChecked ? 'border-accent bg-accent' : 'border-[#d9d9d9] bg-white'"
        >
          <view
              v-if="displayAllChecked"
              class="w-[8px] h-[8px] rounded-full bg-white"
          />
        </view>
        <view class="text-[14px] text-text-main">
          全选
        </view>
      </view>

      <!-- 结算模式 -->
      <template v-if="!isEdit">
        <view class="flex items-center">
          <view class="text-[14px] text-text-main mr-2">
            合计:
          </view>
          <view class="text-[22px] font-bold text-accent">
            ¥{{ totalPrice.toFixed(2) }}
          </view>
        </view>

        <view
            class="bg-accent text-white px-6 py-3 rounded-full text-[14px]"
            @click="goConfirm"
        >
          去结算
        </view>
      </template>

      <!-- 编辑模式 -->
      <template v-else>
        <view class="text-[13px] text-text-secondary">
          已选 {{ checkedCount }} 件
        </view>

        <view
            class="bg-[#C9A96E] text-white px-6 py-3 rounded-full text-[14px]"
            @click="deleteChecked"
        >
          删除
        </view>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import Empty from '@/components/common/Empty.vue'
import { useCart } from '@/hooks/useCart'
import { useUser } from '@/hooks/useUser'
import type { OrderConfirmItem } from '@/types/model/order'
import { useOrderStore } from '@/store/order'
import APP_CONFIG from "@/config/app";

const isEdit = ref(false)
const { isLogin } = useUser()
const {
  cartList,
  checkedList,
  totalPrice,
  getCartList,
  toggleChecked,
  increaseCount,
  decreaseCount,
  clearChecked,
} = useCart()

const orderStore = useOrderStore()

onShow(() => {
  getCartList()
})

function goCategory() {
  uni.switchTab({
    url: '/pages/goods/category',
  })
}

const checkedCount = computed(() => checkedList.value.length)

function isOutOfStock(item: typeof cartList.value[number]) {
  return item.stock <= 0
}

function isSelectableInCurrentMode(item: typeof cartList.value[number]) {
  if (isEdit.value) return true
  return !isOutOfStock(item)
}

const displayAllChecked = computed(() => {
  const currentList = cartList.value.filter(isSelectableInCurrentMode)
  return currentList.length > 0 && currentList.every(item => item.checked)
})

const validCheckedList = computed(() => {
  return checkedList.value.filter(item => item.stock > 0)
})

function handleToggleChecked(item: typeof cartList.value[number]) {
  if (!isSelectableInCurrentMode(item)) {
    uni.showToast({
      title: '库存不足，暂不可结算',
      icon: 'none',
    })
    return
  }

  toggleChecked(item.id)
}

function getCheckClass(item: typeof cartList.value[number]) {
  if (!isSelectableInCurrentMode(item)) {
    return 'border-[#e5e5e5] bg-[#f5f5f5] opacity-50'
  }

  return item.checked
    ? 'border-accent bg-accent'
    : 'border-[#d9d9d9] bg-white'
}

function handleToggleAllChecked() {
  const currentList = cartList.value.filter(isSelectableInCurrentMode)

  if (currentList.length === 0) {
    uni.showToast({
      title: isEdit.value ? '暂无可操作商品' : '暂无可结算商品',
      icon: 'none',
    })
    return
  }

  const nextChecked = !currentList.every(item => item.checked)

  cartList.value.forEach(item => {
    if (isSelectableInCurrentMode(item)) {
      item.checked = nextChecked
    } else {
      item.checked = false
    }
  })
}

async function deleteChecked() {
  if (checkedCount.value === 0) {
    uni.showToast({
      title: '请选择要删除的商品',
      icon: 'none',
    })
    return
  }

  const success = await clearChecked()
  if (!success) return

  if (cartList.value.length === 0) {
    isEdit.value = false
  }

  uni.showToast({
    title: '删除成功',
    icon: 'success',
  })
}

function goConfirm() {
  if (checkedCount.value === 0) {
    uni.showToast({
      title: '请选择要结算的商品',
      icon: 'none',
    })
    return
  }

  if (validCheckedList.value.length === 0) {
    uni.showToast({
      title: '暂无可结算商品',
      icon: 'none',
    })
    return
  }

  if (!isLogin.value) {
    uni.showToast({
      title: '请先登录后结算',
      icon: 'none',
    })

    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/login/index?redirect=%2Fpages%2Forder%2Fconfirm',
      })
    }, 300)
    return
  }

  const confirmGoods: OrderConfirmItem[] = validCheckedList.value.map(item => ({
    id: item.id,
    name: item.name,
    spec: '',
    price: item.price,
    count: item.count,
    image: item.image,
    stock: item.stock,
  }))

  orderStore.setConfirmGoods(confirmGoods)

  uni.navigateTo({
    url: '/pages/order/confirm?from=cart',
  })
}
</script>
