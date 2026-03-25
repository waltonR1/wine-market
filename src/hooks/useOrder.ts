import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  getDefaultAddress as getDefaultAddressApi,
  getConfirmOrderList as getConfirmOrderListApi,
  getOrderList as getOrderListApi,
  createOrder as createOrderApi,
  cancelOrder as cancelOrderApi,
  confirmReceiveOrder as confirmReceiveOrderApi,
  getOrderDetail as getOrderDetailApi,
  payOrder as payOrderApi,
} from '@/api'
import { useOrderStore } from '@/store/order'
import type { AddressInfo } from '@/types/model/address'
import type { OrderConfirmItem, OrderDetail, OrderItem, PayOrderParams } from '@/types/model/order'
import type {CreateOrderRequest} from "@/types/api/order";

export function useOrder() {
  const orderStore = useOrderStore()
  const { confirmGoodsList, currentAddress } = storeToRefs(orderStore)

  const pageLoading = ref(false)      // 列表 / 详情加载
  const actionLoading = ref(false)    // 取消 / 收货 / 提交
  const payLoading = ref(false)       // 支付专用
  const defaultAddress = ref<AddressInfo | null>(currentAddress.value || null)
  const confirmOrderList = ref<OrderConfirmItem[]>([])
  const orderList = ref<OrderItem[]>([])
  const orderDetail = ref<OrderDetail | null>(null)

  function patchOrderState(
    id: string | number,
    status: OrderDetail['status'],
    statusLabel: string,
    extra: Partial<OrderDetail> = {}
  ) {
    if (orderDetail.value && String(orderDetail.value.id) === String(id)) {
      orderDetail.value = {
        ...orderDetail.value,
        status,
        statusLabel,
        ...extra,
      }
    }

    orderList.value = orderList.value.map(item =>
      String(item.id) === String(id)
        ? {
          ...item,
          status,
          statusLabel,
          ...extra,
        }
        : item
    )
  }

  async function fetchDefaultAddress() {
    if (currentAddress.value) {
      defaultAddress.value = currentAddress.value
      return currentAddress.value
    }

    pageLoading.value = true
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
    } catch {
      uni.showToast({ title: '地址加载失败', icon: 'none' })
      defaultAddress.value = null
      return null
    } finally {
      pageLoading.value = false
    }
  }

  async function fetchConfirmOrderList() {
    if (confirmGoodsList.value.length > 0) {
      confirmOrderList.value = confirmGoodsList.value
      return confirmGoodsList.value
    }

    pageLoading.value = true
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
    } catch {
      uni.showToast({ title: '订单商品加载失败', icon: 'none' })
      confirmOrderList.value = []
      return []
    } finally {
      pageLoading.value = false
    }
  }

  async function fetchOrderList(status?: number) {
    pageLoading.value = true
    try {
      const res = await getOrderListApi()
      if (res.code === 0) {
        const data = status !== undefined && status !== 0 ? res.data.filter(item => item.status === status) : res.data
        orderList.value = data
        return data
      }
      uni.showToast({ title: res.message || '订单加载失败', icon: 'none' })
      orderList.value = []
      return []
    } catch {
      uni.showToast({ title: '订单加载失败', icon: 'none' })
      orderList.value = []
      return []
    } finally {
      pageLoading.value = false
    }
  }

  async function submitOrder(payload:CreateOrderRequest) {
    actionLoading.value = true
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
    } catch {
      uni.showToast({
        title: '提交订单失败',
        icon: 'none',
      })
      return null
    } finally {
      actionLoading.value = false
    }
  }

  async function cancelOrder(id: string | number) {
    actionLoading.value = true
    try {
      const res = await cancelOrderApi(id)
      if (res.code === 0) {
        patchOrderState(id, 6, '已取消')
        return true
      }

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
      actionLoading.value = false
    }
  }

  async function confirmReceiveOrder(id: string | number) {
    actionLoading.value = true
    try {
      const res = await confirmReceiveOrderApi(id)
      if (res.code === 0) {
        patchOrderState(id, 4, '待评价')
        return true
      }

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
      actionLoading.value = false
    }
  }

  async function fetchOrderDetail(id: string | number) {
    orderDetail.value = null
    pageLoading.value = true
    try {
      const res = await getOrderDetailApi(String(id))
      if (res.code === 0) {
        orderDetail.value = res.data.order
        return res.data.order
      }

      uni.showToast({
        title: res.message || '订单详情加载失败',
        icon: 'none',
      })
      orderDetail.value = null
      return null
    } catch {
      uni.showToast({
        title: '订单详情加载失败',
        icon: 'none',
      })
      orderDetail.value = null
      return null
    } finally {
      pageLoading.value = false
    }
  }

  async function payOrder(payload: PayOrderParams) {
    payLoading.value = true
    try {
      const res = await payOrderApi(payload)
      if (res.code === 0) {
        patchOrderState(payload.id, res.data.status, res.data.statusLabel, {
          payTime: res.data.payTime,
          payType: payload.payType,
        })

        return res.data
      }

      uni.showToast({
        title: res.message || '支付失败',
        icon: 'none',
      })
      return null
    } catch {
      uni.showToast({
        title: '支付失败',
        icon: 'none',
      })
      return null
    } finally {
      payLoading.value = false
    }
  }

  return {
    pageLoading,
    actionLoading,
    payLoading,
    defaultAddress,
    confirmOrderList,
    orderList,
    orderDetail,
    fetchDefaultAddress,
    fetchConfirmOrderList,
    fetchOrderList,
    submitOrder,
    cancelOrder,
    confirmReceiveOrder,
    fetchOrderDetail,
    payOrder
  }
}

