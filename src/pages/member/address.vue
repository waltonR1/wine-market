<template>
  <view class="min-h-screen bg-background pb-20">
    <view class="p-4">
      <template v-if="addressList.length > 0">
        <AddressCard
          v-for="item in addressList"
          :key="item.id"
          :item="item"
          @edit="handleEdit"
          @delete="handleDelete"
          @set-default="handleSetDefault"
        />
      </template>

      <view v-else class="flex flex-col items-center pt-32">
        <view class="text-[60px] mb-4 opacity-20">📍</view>
        <view class="text-[14px] text-[#999]">暂无收货地址</view>
      </view>
    </view>

    <view class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#F0F0F0] safe-area-inset-bottom">
      <view
        class="bg-accent text-white text-center py-3 rounded-full text-[15px] font-medium shadow-lg active:opacity-90"
        @click="handleAdd"
      >
        + 新增收货地址
      </view>
    </view>
  </view>

  <AddressForm
    v-if="formVisible"
    :form="form"
    :is-edit="isEdit"
    @close="closeForm"
    @default-change="handleDefaultSwitch"
    @region-change="handleRegionChange"
    @submit="submitForm"
  />
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import type { AddressInfo } from '@/types/model/address'
import AddressCard from './components/AddressCard.vue'
import AddressForm from './components/AddressForm.vue'
import { useAddress } from '@/hooks/useAddress'

const {
  addressList,
  formVisible,
  isEdit,
  form,
  fetchList,
  openAdd,
  openEdit,
  closeForm,
  setFormDefault,
  setRegion,
  submitForm,
  remove,
  setDefault,
} = useAddress()

onShow(() => {
  fetchList()
})

function handleDefaultSwitch(value: boolean) {
  setFormDefault(value)
}

function handleRegionChange(value: string[]) {
  setRegion(value)
}

function handleAdd() {
  openAdd()
}

function handleEdit(item: AddressInfo) {
  openEdit(item)
}

function handleSetDefault(item: AddressInfo) {
  setDefault(item)
}

function handleDelete(item: AddressInfo) {
  uni.showModal({
    title: '提示',
    content: '确定要删除该地址吗？',
    success: async (res) => {
      if (res.confirm) {
        await remove(item)
      }
    },
  })
}
</script>

<style scoped>
.safe-area-inset-bottom {
  padding-bottom: calc(16px + constant(safe-area-inset-bottom));
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}
</style>
