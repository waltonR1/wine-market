import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  getDefaultAddress as getDefaultAddressApi,
  getConfirmOrderList as getConfirmOrderListApi,
  getOrderList as getOrderListApi,
  createOrder as createOrderApi,
  cancelOrder as cancelOrderApi,
  confirmReceiveOrder as confirmReceiveOrderApi,
} from '@/api'
import { useOrderStore } from '@/store/order'
import type { AddressInfo } from '@/types/model/address'
import type { OrderConfirmItem, OrderItem } from '@/types/model/order'

export function useOrder() {
  const orderStore = useOrderStore()
  const { confirmGoodsList, currentAddress } = storeToRefs(orderStore)

  const loading = ref(false)
  const defaultAddress = ref<AddressInfo | null>(currentAddress.value || null)
  const confirmOrderList = ref<OrderConfirmItem[]>([])
  const orderList = ref<OrderItem[]>([])

  async function fetchDefaultAddress() {
    if (currentAddress.value) {
      defaultAddress.value = currentAddress.value
      return currentAddress.value
    }

    loading.value = true
    try {
      const res = await getDefaultAddressApi()
      if (res.code === 0) {
        defaultAddress.value = res.data
        if (res.data) {
          orderStore.setCurrentAddress(res.data)
        }
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

  async function fetchConfirmOrderList() {
    if (confirmGoodsList.value.length > 0) {
      confirmOrderList.value = confirmGoodsList.value
      return confirmGoodsList.value
    }

    loading.value = true
    try {
      const res = await getConfirmOrderListApi()
      if (res.code === 0) {
        confirmOrderList.value = res.data
        orderStore.setConfirmGoods(res.data)
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

  async function submitOrder(payload: {
    goods: OrderConfirmItem[]
    address: AddressInfo
    remark?: string
    from?: 'cart' | 'buyNow'
  }) {
    loading.value = true
    try {
      const res = await createOrderApi(payload)
      if (res.code === 0) {
        orderStore.clearConfirmInfo()
        confirmOrderList.value = []
        return res.data
      }

      uni.showToast({
        title: res.message || '提交订单失败',
        icon: 'none',
      })
      return null
    } catch (err) {
      uni.showToast({
        title: '提交订单失败',
        icon: 'none',
      })
      return null
    } finally {
      loading.value = false
    }
  }

  async function cancelOrder(id: string | number) {
    loading.value = true
    try {
      const res = await cancelOrderApi(id)
      if (res.code === 0) return true

      uni.showToast({
        title: res.message || '取消订单失败',
        icon: 'none',
      })
      return false
    } catch {
      uni.showToast({
        title: '取消订单失败',
        icon: 'none',
      })
      return false
    } finally {
      loading.value = false
    }
  }

  async function confirmReceiveOrder(id: string | number) {
    loading.value = true
    try {
      const res = await confirmReceiveOrderApi(id)
      if (res.code === 0) return true

      uni.showToast({
        title: res.message || '确认收货失败',
        icon: 'none',
      })
      return false
    } catch {
      uni.showToast({
        title: '确认收货失败',
        icon: 'none',
      })
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    defaultAddress,
    confirmOrderList,
    orderList,
    fetchDefaultAddress,
    fetchConfirmOrderList,
    fetchOrderList,
    submitOrder,
    cancelOrder,
    confirmReceiveOrder,
  }
}

