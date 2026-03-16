import { ref } from 'vue'
import {
  getAddressList as getAddressListApi,
  getConfirmOrderList as getConfirmOrderListApi,
  getDefaultAddress as getDefaultAddressApi,
  getOrderList as getOrderListApi,
} from '@/api/modules/order'
import type { AddressInfo, OrderConfirmItem, OrderItem } from '@/types/model/order'

export function useOrder() {
  const loading = ref(false)
  const defaultAddress = ref<AddressInfo | null>(null)
  const addressList = ref<AddressInfo[]>([])
  const confirmOrderList = ref<OrderConfirmItem[]>([])
  const orderList = ref<OrderItem[]>([])

  async function  fetchDefaultAddress() {
    loading.value = true
    try {
      const res = await getDefaultAddressApi()
      if (res.code === 0) {
        defaultAddress.value = res.data
        return res.data
      }
      uni.showToast({ title: res.message || '地址加载失败', icon: 'none' })
      defaultAddress.value = null
      return null
    } catch (err) {
      uni.showToast({ title: '地址加载失败', icon: 'none' })
      defaultAddress.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchAddressList() {
    loading.value = true
    try {
      const res = await getAddressListApi()
      if (res.code === 0) {
        addressList.value = res.data
        return res.data
      }
      uni.showToast({ title: res.message || '获取地址列表失败', icon: 'none' })
      addressList.value = []
      return []
    } catch (err) {
      uni.showToast({ title: '获取地址列表失败', icon: 'none' })
      addressList.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchConfirmOrderList() {
    loading.value = true
    try {
      const res = await getConfirmOrderListApi()
      if (res.code === 0) {
        confirmOrderList.value = res.data
        return res.data
      }
      uni.showToast({ title: res.message || '订单商品加载失败', icon: 'none' })
      confirmOrderList.value = []
      return []
    } catch (err) {
      uni.showToast({ title: '订单商品加载失败', icon: 'none' })
      confirmOrderList.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchOrderList(status?: number) {
    loading.value = true
    try {
      const res = await getOrderListApi()
      if (res.code === 0) {
        const data = status && status !== 0 ? res.data.filter(item => item.status === status) : res.data
        orderList.value = data
        return data
      }
      uni.showToast({ title: res.message || '订单加载失败', icon: 'none' })
      orderList.value = []
      return []
    } catch (err) {
      uni.showToast({ title: '订单加载失败', icon: 'none' })
      orderList.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    defaultAddress,
    addressList,
    confirmOrderList,
    orderList,
    fetchDefaultAddress,
    fetchAddressList,
    fetchConfirmOrderList,
    fetchOrderList,
  }
}

