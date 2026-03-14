<template>
  <view class="min-h-screen bg-[#F8F8F8] pb-20">
    <view class="p-4">
      <template v-if="addressList.length > 0">
        <view
            v-for="item in addressList"
            :key="item.id"
            class="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          <view class="flex justify-between items-start mb-2">
            <view class="flex items-center">
              <text class="text-[16px] font-bold mr-3">{{ item.name }}</text>
              <text class="text-[14px] text-[#666]">{{ item.phone }}</text>
            </view>
            <view
                v-if="item.isDefault"
                class="bg-[#6B0F1A] text-white text-[10px] px-2 py-0.5 rounded-md"
            >
              默认
            </view>
          </view>
          <view class="text-[13px] text-[#333] mb-4 leading-relaxed">
            {{ item.province }}{{ item.city }}{{ item.district }}{{ item.detail }}
          </view>
          <view class="border-t border-[#F5F5F5] pt-3 flex justify-end gap-4">
            <view class="flex items-center text-[12px] text-[#666]" @click="handleEdit(item)">
              <text class="mr-1">✏️</text> 编辑
            </view>
            <view class="flex items-center text-[12px] text-[#666]" @click="handleDelete(item)">
              <text class="mr-1">🗑️</text> 删除
            </view>
          </view>
        </view>
      </template>

      <!-- 空状态 -->
      <view v-else class="flex flex-col items-center pt-32">
        <view class="text-[60px] mb-4 opacity-20">📍</view>
        <view class="text-[14px] text-[#999]">暂无收货地址</view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#F0F0F0] safe-area-inset-bottom">
      <view
          class="bg-[#6B0F1A] text-white text-center py-3 rounded-full text-[15px] font-medium shadow-lg active:opacity-90"
          @click="handleAdd"
      >
        + 新增收货地址
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getAddressList } from '@/api'
import type { AddressInfo } from '@/types/model/order'

const addressList = ref<AddressInfo[]>([])

const fetchAddressList = async () => {
  try {
    const res = await getAddressList()
    if (res.code === 0) {
      addressList.value = res.data
    }
  } catch (error) {
    uni.showToast({
      title: '获取地址列表失败',
      icon: 'none'
    })
  }
}

onShow(() => {
  fetchAddressList()
})

const handleAdd = () => {
  uni.showToast({
    title: '新增地址功能开发中',
    icon: 'none'
  })
}

const handleEdit = (item: AddressInfo) => {
  uni.showToast({
    title: `编辑地址: ${item.name}`,
    icon: 'none'
  })
}

const handleDelete = (item: AddressInfo) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除该地址吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '删除成功',
          icon: 'success'
        })
      }
    }
  })
}
</script>

<style scoped>
.safe-area-inset-bottom {
  padding-bottom: calc(16px + constant(safe-area-inset-bottom));
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}
</style>
