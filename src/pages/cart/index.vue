<template>
  <view class="min-h-screen bg-[#F7F3EE] pb-[120px]">
    <!-- 顶部店铺栏 -->
    <view class="bg-white px-4 py-4 flex items-center justify-between border-b border-[#eee]">
      <view class="flex items-center">
        <view class="text-[16px] mr-2">🏪</view>
        <view class="text-[15px] font-medium text-[#2C2C2C]">
          卡迈高
        </view>
      </view>

      <view
          class="text-[14px] text-[#6B0F1A]"
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
            :class="item.checked ? 'border-[#6B0F1A] bg-[#6B0F1A]' : 'border-[#d9d9d9] bg-white'"
            @click="toggleItem(item.id)"
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
              <view class="text-[14px] text-[#2C2C2C] leading-5 font-medium line-clamp-2">
                {{ item.name }}
              </view>
              <view class="text-[12px] text-[#8B7B6B] mt-2">
                快递
              </view>
            </view>

            <view class="text-[18px] font-bold text-[#6B0F1A] whitespace-nowrap">
              ¥ {{ item.price.toFixed(2) }}
            </view>
          </view>

          <view class="mt-3 flex items-center justify-end">
            <view class="flex items-center">
              <view
                  class="w-[28px] h-[28px] rounded-full bg-[#F5F1EC] flex items-center justify-center text-[#6B0F1A] text-[16px]"
                  @click="decreaseCount(item.id)"
              >
                −
              </view>

              <view class="mx-3 text-[14px] text-[#2C2C2C] min-w-[14px] text-center">
                {{ item.count }}
              </view>

              <view
                  class="w-[28px] h-[28px] rounded-full bg-[#F5F1EC] flex items-center justify-center text-[#6B0F1A] text-[16px]"
                  @click="increaseCount(item.id)"
              >
                +
              </view>
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
      <view class="flex items-center" @click="toggleAll">
        <view
            class="w-[22px] h-[22px] rounded-full border flex items-center justify-center mr-2"
            :class="isAllChecked ? 'border-[#6B0F1A] bg-[#6B0F1A]' : 'border-[#d9d9d9] bg-white'"
        >
          <view
              v-if="isAllChecked"
              class="w-[8px] h-[8px] rounded-full bg-white"
          />
        </view>
        <view class="text-[14px] text-[#2C2C2C]">
          全选
        </view>
      </view>

      <!-- 结算模式 -->
      <template v-if="!isEdit">
        <view class="flex items-center">
          <view class="text-[14px] text-[#2C2C2C] mr-2">
            合计:
          </view>
          <view class="text-[22px] font-bold text-[#6B0F1A]">
            ¥{{ totalPrice.toFixed(2) }}
          </view>
        </view>

        <view
            class="bg-[#6B0F1A] text-white px-6 py-3 rounded-full text-[14px]"
            @click="goConfirm"
        >
          去结算
        </view>
      </template>

      <!-- 编辑模式 -->
      <template v-else>
        <view class="text-[13px] text-[#8B7B6B]">
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
import { getCartList } from '@/api'
import type { CartItem } from '@/types/model/cart'
import { onShow } from '@dcloudio/uni-app'
import { hasToken } from '@/utils/auth'
import Empty from '@/components/common/Empty.vue'

const isEdit = ref(false)
const isLogin = ref(false)
const cartList = ref<CartItem[]>([])

function goCategory() {
  uni.switchTab({
    url: '/pages/goods/category',
  })
}

onShow(async () => {
  isLogin.value = hasToken()

  const res = await getCartList()

  if (res.code === 0) {
    cartList.value = res.data
  } else {
    uni.showToast({
      title: res.message || '购物车加载失败',
      icon: 'none',
    })
  }
})

const checkedList = computed(() => {
  return cartList.value.filter(item => item.checked)
})

const checkedCount = computed(() => {
  return checkedList.value.length
})

const totalPrice = computed(() => {
  return checkedList.value.reduce((sum, item) => {
    return sum + item.price * item.count
  }, 0)
})

const isAllChecked = computed(() => {
  return cartList.value.length > 0 && cartList.value.every(item => item.checked)
})

function toggleItem(id: number) {
  const target = cartList.value.find(item => item.id === id)
  if (target) {
    target.checked = !target.checked
  }
}

function toggleAll() {
  const next = !isAllChecked.value
  cartList.value.forEach(item => {
    item.checked = next
  })
}

function decreaseCount(id: number) {
  const target = cartList.value.find(item => item.id === id)
  if (target && target.count > 1) {
    target.count -= 1
  }
}

function increaseCount(id: number) {
  const target = cartList.value.find(item => item.id === id)
  if (target) {
    target.count += 1
  }
}

function deleteChecked() {
  if (checkedCount.value === 0) {
    uni.showToast({
      title: '请选择要删除的商品',
      icon: 'none',
    })
    return
  }

  cartList.value = cartList.value.filter(item => !item.checked)

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

  uni.navigateTo({
    url: '/pages/order/confirm',
  })
}
</script>
