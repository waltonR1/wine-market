import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AddressInfo, OrderConfirmItem } from '@/types/model/order'

export const useOrderStore = defineStore('order', () => {
  // 当前选择的收货地址
  const currentAddress = ref<AddressInfo | null>(null)
  
  // 确认订单的商品列表
  const confirmGoodsList = ref<OrderConfirmItem[]>([])
  
  // 设置当前收货地址
  function setCurrentAddress(val: AddressInfo) {
    currentAddress.value = val
  }
  
  // 设置确认订单商品
  function setConfirmGoods(val: OrderConfirmItem[]) {
    confirmGoodsList.value = val
  }
  
  // 清空确认订单信息
  function clearConfirmInfo() {
    confirmGoodsList.value = []
    currentAddress.value = null
  }

  return {
    currentAddress,
    confirmGoodsList,
    setCurrentAddress,
    setConfirmGoods,
    clearConfirmInfo,
  }
})
