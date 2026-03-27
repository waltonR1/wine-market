<template>
  <view class="min-h-screen bg-background pb-20">
    <view class="p-4">
      <template v-if="addressList.length > 0">
        <view
          v-for="item in addressList"
          :key="item.id"
          @click="handleSelectAddress(item)"
        >
          <AddressCard
            :item="item"
            :select-mode="isSelectMode"
            @edit="handleEdit"
            @delete="handleDelete"
            @set-default="handleSetDefault"
          />
        </view>
      </template>

      <view v-else class="flex flex-col items-center pt-32">
        <view class="mb-4 text-[60px] text-empty-illustration">📍</view>
        <view class="text-[14px] text-text-muted">暂无收货地址</view>
      </view>
    </view>

    <view class="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-divider safe-area-inset-bottom">
      <view
            class="bg-cta text-text-inverse text-center py-3 rounded-full text-[15px] font-medium shadow-lg active:opacity-90"
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
import {onLoad, onShow} from '@dcloudio/uni-app'
import type { AddressInfo } from '@/types/model/address'
import AddressCard from './components/AddressCard.vue'
import AddressForm from './components/AddressForm.vue'
import { useAddress } from '@/hooks/useAddress'
import { ref } from 'vue'
import { useOrderStore } from '@/store/order'

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

const isSelectMode = ref(false)
const orderStore = useOrderStore()

onLoad((options) => {
  isSelectMode.value = options?.select === '1'
})

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

function handleSelectAddress(item: AddressInfo) {
  if (!isSelectMode.value) return

  orderStore.setCurrentAddress(item)

  uni.navigateBack()
}
</script>

<style scoped>
.safe-area-inset-bottom {
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
}
</style>

