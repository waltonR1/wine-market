import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  getDefaultAddress as getDefaultAddressApi,
  getConfirmOrderList as getConfirmOrderListApi,
  getOrderList as getOrderListApi,
  createOrder as createOrderApi,
  cancelOrder as cancelOrderApi,
  confirmReceiveOrder as confirmReceiveOrderApi,
  deleteOrder as deleteOrderApi,
  getOrderDetail as getOrderDetailApi,
  payOrder as payOrderApi,
  rebuyOrder as rebuyOrderApi,
  commentOrder as commentOrderApi,
  applyAfterSale as applyAfterSaleApi,
  advanceAfterSale as advanceAfterSaleApi,
} from '@/api'
import { useOrderStore } from '@/store/order'
import { useCart } from '@/hooks/useCart'
import { normalizeOrder } from '@/utils/order'
import type { AddressInfo } from '@/types/model/address'
import type {
  ApplyAfterSaleParams,
  CommentOrderParams,
  OrderConfirmItem,
  OrderDetail,
  OrderItem,
  OrderStatus,
  PayOrderParams,
} from '@/types/model/order'
import type { CreateOrderRequest } from '@/types/api/order'

function normalizeOrderList(list: OrderItem[]) {
  return list.map(item => normalizeOrder(item))
}

function normalizeOrderDetail(order: OrderDetail) {
  return normalizeOrder(order)
}

export function useOrder() {
  const orderStore = useOrderStore()
  const { confirmGoodsList, currentAddress } = storeToRefs(orderStore)
  const { refreshCartWithCheckedIds } = useCart()

  const pageLoading = ref(false)
  const actionLoading = ref(false)
  const payLoading = ref(false)
  const defaultAddress = ref<AddressInfo | null>(currentAddress.value || null)
  const confirmOrderList = ref<OrderConfirmItem[]>([])
  const orderList = ref<OrderItem[]>([])
  const orderDetail = ref<OrderDetail | null>(null)

  function patchOrderState(
    id: string | number,
    status: OrderStatus,
    statusPatch: Partial<OrderDetail> = {}
  ) {
    if (orderDetail.value && String(orderDetail.value.id) === String(id)) {
      orderDetail.value = normalizeOrderDetail({
        ...orderDetail.value,
        status,
        ...statusPatch,
      })
    }

    orderList.value = orderList.value.map(item =>
      String(item.id) === String(id)
        ? normalizeOrder({
            ...item,
            status,
            ...statusPatch,
          })
        : item
    )
  }

  function removeOrderState(id: string | number) {
    if (orderDetail.value && String(orderDetail.value.id) === String(id)) {
      orderDetail.value = null
    }

    orderList.value = orderList.value.filter(item => String(item.id) !== String(id))
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
        const list = normalizeOrderList(res.data)
        const data = status !== undefined && status !== 0 ? list.filter(item => item.status === status) : list
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

  async function submitOrder(payload: CreateOrderRequest) {
    actionLoading.value = true
    try {
      const res = await createOrderApi(payload)
      if (res.code === 0) {
        orderStore.clearConfirmInfo()
        confirmOrderList.value = []
        return normalizeOrder(res.data)
      }

      uni.showToast({ title: res.message || '提交订单失败', icon: 'none' })
      return null
    } catch {
      uni.showToast({ title: '提交订单失败', icon: 'none' })
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
        patchOrderState(id, res.data.status, res.data)
        return true
      }

      uni.showToast({ title: res.message || '取消订单失败', icon: 'none' })
      return false
    } catch {
      uni.showToast({ title: '取消订单失败', icon: 'none' })
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
        patchOrderState(id, res.data.status, res.data)
        return true
      }

      uni.showToast({ title: res.message || '确认收货失败', icon: 'none' })
      return false
    } catch {
      uni.showToast({ title: '确认收货失败', icon: 'none' })
      return false
    } finally {
      actionLoading.value = false
    }
  }

  async function deleteOrder(id: string | number) {
    actionLoading.value = true
    try {
      const res = await deleteOrderApi(id)
      if (res.code === 0) {
        removeOrderState(id)
        return true
      }

      uni.showToast({ title: res.message || '删除订单失败', icon: 'none' })
      return false
    } catch {
      uni.showToast({ title: '删除订单失败', icon: 'none' })
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
        orderDetail.value = normalizeOrderDetail(res.data.order)
        return orderDetail.value
      }

      uni.showToast({ title: res.message || '订单详情加载失败', icon: 'none' })
      orderDetail.value = null
      return null
    } catch {
      uni.showToast({ title: '订单详情加载失败', icon: 'none' })
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
        patchOrderState(payload.id, res.data.status, {
          ...res.data,
          payType: payload.payType,
        })
        return res.data
      }

      uni.showToast({ title: res.message || '支付失败', icon: 'none' })
      return null
    } catch {
      uni.showToast({ title: '支付失败', icon: 'none' })
      return null
    } finally {
      payLoading.value = false
    }
  }

  async function rebuyOrder(id: string | number) {
    actionLoading.value = true
    try {
      const res = await rebuyOrderApi(id)
      if (res.code === 0) {
        await refreshCartWithCheckedIds(res.data.affectedIds, true)
        return true
      }

      uni.showToast({ title: res.message || '再次购买失败', icon: 'none' })
      return false
    } catch {
      uni.showToast({ title: '再次购买失败', icon: 'none' })
      return false
    } finally {
      actionLoading.value = false
    }
  }

  async function submitComment(payload: CommentOrderParams) {
    actionLoading.value = true
    try {
      const res = await commentOrderApi(payload)
      if (res.code === 0) {
        patchOrderState(payload.id, res.data.status, res.data)
        return true
      }

      uni.showToast({ title: res.message || '评价提交失败', icon: 'none' })
      return false
    } catch {
      uni.showToast({ title: '评价提交失败', icon: 'none' })
      return false
    } finally {
      actionLoading.value = false
    }
  }

  async function applyAfterSale(payload: ApplyAfterSaleParams) {
    actionLoading.value = true
    try {
      const res = await applyAfterSaleApi(payload)
      if (res.code === 0) {
        patchOrderState(payload.id, res.data.status, res.data)
        return true
      }

      uni.showToast({ title: res.message || '售后申请失败', icon: 'none' })
      return false
    } catch {
      uni.showToast({ title: '售后申请失败', icon: 'none' })
      return false
    } finally {
      actionLoading.value = false
    }
  }

  async function advanceAfterSale(id: string | number) {
    actionLoading.value = true
    try {
      const res = await advanceAfterSaleApi(id)
      if (res.code === 0) {
        patchOrderState(id, res.data.status, res.data)
        return true
      }

      uni.showToast({ title: res.message || '售后状态推进失败', icon: 'none' })
      return false
    } catch {
      uni.showToast({ title: '售后状态推进失败', icon: 'none' })
      return false
    } finally {
      actionLoading.value = false
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
    deleteOrder,
    fetchOrderDetail,
    payOrder,
    rebuyOrder,
    submitComment,
    applyAfterSale,
    advanceAfterSale,
  }
}
