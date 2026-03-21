import { storeToRefs } from 'pinia'
import { useCartStore } from '@/store/cart'
import { useUser } from '@/hooks/useUser'
import {
  getCartList as getCartListApi,
  addCartItem,
  updateCartItemCount,
  deleteCartItem,
} from '@/api/modules/cart'

import type { CartItem } from '@/types/model/cart'
import type { ProductItem } from '@/types/model/goods'
import type { CartServerItem } from '@/types/api/cart'

import { APP_CONFIG } from '@/config/app'

export function useCart() {
  const cartStore = useCartStore()
  const { isLogin } = useUser()

  const { cartList, checkedList, isAllChecked, totalPrice, totalCount } = storeToRefs(cartStore)

  /**
   * 用接口返回的数据统一同步 store
   */
  function syncCartList(list: CartItem[]) {
    cartStore.setCartList(list)
  }

  /**
   * 将服务器返回的购物车数据转换为前端使用的 CartItem 列表
   *
   * 主要作用：
   * 1. 将 CartServerItem 转换为前端 CartItem 结构
   * 2. 保留当前本地购物车中的 checked 状态（用户勾选状态）
   *
   * 处理逻辑：
   * - 服务器返回的数据通常不包含 checked 字段
   * - 因此需要从 current（当前 store 中的购物车列表）中恢复对应商品的 checked 状态
   * - 如果该商品之前不存在于 current 中，则默认 checked = true
   *
   * @param serverList 服务器返回的购物车数据
   * @param current 当前 store 中已有的购物车列表
   * @returns 转换后的前端购物车列表
   */
  function toClientList(serverList: CartServerItem[] | undefined, current: CartItem[]) {
    const checkedMap = new Map<number, boolean>()
    current.forEach(item => checkedMap.set(item.id, item.checked))

    return (serverList || []).map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      count: item.count,
      image: item.image,
      checked: checkedMap.get(item.id) ?? true,
    }))
  }

  /**
   * 获取购物车列表
   * 未登录时：直接使用本地购物车
   * 已登录时：拉取服务端购物车
   */
  async function getCartList() {
    if (!isLogin.value) {
      return cartList.value
    }

    try {
      const res = await getCartListApi()

      if (res.code === 0) {
        const nextList = toClientList(res.data, cartList.value)
        syncCartList(nextList)
        return nextList
      }

      uni.showToast({
        title: res.message || '购物车加载失败',
        icon: 'none',
      })
      return []
    } catch (error) {
      uni.showToast({
        title: '购物车加载失败',
        icon: 'none',
      })
      return []
    }
  }

  /**
   * 添加到购物车
   * 未登录：只更新本地
   * 已登录：先本地更新，再同步后端，失败回滚
   */
  async function addToCart(goods: CartItem) {
    const oldList = cartList.value.map(item => ({ ...item }))

    // 先本地更新
    cartStore.addToCart(goods)

    // 未登录时只保留本地购物车
    if (!isLogin.value) {
      uni.showToast({
        title: '已添加到购物车',
        icon: 'success',
      })
      return true
    }

    try {
      const res = await addCartItem({
        id: goods.id,
        count: goods.count,
      })

      if (res.code === 0) {
        if (APP_CONFIG.CART_SYNC_STRATEGY === 'server') {
          syncCartList(toClientList(res.data, cartList.value))
        }

        uni.showToast({
          title: '已添加到购物车',
          icon: 'success',
        })
        return true
      }

      // 失败回滚
      cartStore.setCartList(oldList)
      uni.showToast({
        title: res.message || '添加失败',
        icon: 'none',
      })
      return false
    } catch (error) {
      cartStore.setCartList(oldList)
      uni.showToast({
        title: '添加失败',
        icon: 'none',
      })
      return false
    }
  }

  /**
   * 商品转购物车项后添加
   */
  async function addProductToCart(product: ProductItem) {
    const goods: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      count: 1,
      checked: true,
      image: product.image,
    }

    return addToCart(goods)
  }

  /**
   * 更新商品数量
   * 未登录：只更新本地
   * 已登录：乐观更新 + 失败回滚
   */
  async function updateCount(id: number, count: number) {
    const target = cartList.value.find(item => item.id === id)
    if (!target) return false

    const oldCount = target.count

    // 数量没变，不处理
    if (oldCount === count) {
      return true
    }

    // 简单校验
    if (count < 1) {
      uni.showToast({
        title: '商品数量不能小于 1',
        icon: 'none',
      })
      return false
    }

    // 先本地更新
    cartStore.updateCount(id, count)

    // 未登录时只改本地
    if (!isLogin.value) {
      return true
    }

    try {
      const res = await updateCartItemCount({ id, count })

      if (res.code === 0) {
        syncCartList(toClientList(res.data, cartList.value))
        return true
      }

      // 失败回滚
      cartStore.updateCount(id, oldCount)
      uni.showToast({
        title: res.message || '更新数量失败',
        icon: 'none',
      })
      return false
    } catch (error) {
      cartStore.updateCount(id, oldCount)
      uni.showToast({
        title: '更新数量失败',
        icon: 'none',
      })
      return false
    }
  }

  /**
   * 数量 +1
   */
  async function increaseCount(id: number) {
    const target = cartList.value.find(item => item.id === id)
    if (!target) return false

    return updateCount(id, target.count + 1)
  }

  /**
   * 数量 -1
   */
  async function decreaseCount(id: number) {
    const target = cartList.value.find(item => item.id === id)
    if (!target || target.count <= 1) return false

    return updateCount(id, target.count - 1)
  }

  /**
   * 切换单个商品选中状态
   * 未登录：只更新本地
   * 已登录：乐观更新 + 失败回滚
   */
  async function toggleChecked(id: number) {
    const target = cartList.value.find(item => item.id === id)
    if (!target) return false

    cartStore.toggleChecked(id)
    return true
  }

  /**
   * 切换全选状态
   * 未登录：只更新本地
   * 已登录：乐观更新 + 失败回滚
   */
  async function toggleAllChecked() {
    cartStore.toggleAllChecked()
    return true
  }

  /**
   * 删除单个商品
   * 未登录：只更新本地
   * 已登录：乐观更新 + 失败回滚
   */
  async function removeFromCart(id: number) {
    const target = cartList.value.find(item => item.id === id)
    if (!target) return false

    const oldList = cartList.value.map(item => ({ ...item }))

    // 先本地删除
    cartStore.removeFromCart(id)

    // 未登录时只改本地
    if (!isLogin.value) {
      return true
    }

    try {
      const res = await deleteCartItem(id)

      if (res.code === 0) {
        syncCartList(toClientList(res.data, cartList.value))
        return true
      }

      // 失败回滚
      cartStore.setCartList(oldList)
      uni.showToast({
        title: res.message || '删除失败',
        icon: 'none',
      })
      return false
    } catch (error) {
      cartStore.setCartList(oldList)
      uni.showToast({
        title: '删除失败',
        icon: 'none',
      })
      return false
    }
  }

  /**
   * 删除已选商品
   * 未登录：直接删本地已选项
   * 已登录：先本地删，再同步后端，失败回滚
   */
  async function clearChecked() {
    const ids = checkedList.value.map(item => item.id)

    if (ids.length === 0) {
      return false
    }

    const oldList = cartList.value.map(item => ({ ...item }))

    // 先本地删除已选商品
    cartStore.clearChecked()

    // 未登录时只改本地
    if (!isLogin.value) {
      return true
    }

    try {
      let lastServerList: CartServerItem[] | undefined = undefined
      for (const id of ids) {
        const res = await deleteCartItem(id)
        if (res.code !== 0) {
          cartStore.setCartList(oldList)
          uni.showToast({ title: res.message || '删除失败', icon: 'none' })
          return false
        }
        lastServerList = res.data
      }

      syncCartList(toClientList(lastServerList, cartList.value))
      return true
    } catch (error) {
      cartStore.setCartList(oldList)
      uni.showToast({
        title: '删除失败',
        icon: 'none',
      })
      return false
    }
  }

  /**
   * 清空购物车
   * 未登录：只清本地
   * 已登录：先清本地，再同步后端，失败回滚
   */
  async function clearCart() {
    const oldList = cartList.value.map(item => ({ ...item }))
    const ids = oldList.map(item => item.id)

    // 先本地清空
    cartStore.resetCart()

    // 未登录时只改本地
    if (!isLogin.value) {
      return true
    }

    try {
      for (const id of ids) {
        const res = await deleteCartItem(id)
        if (res.code !== 0) {
          cartStore.setCartList(oldList)
          uni.showToast({ title: res.message || '清空购物车失败', icon: 'none' })
          return false
        }
      }

      return true
    } catch (error) {
      cartStore.setCartList(oldList)
      uni.showToast({
        title: '清空购物车失败',
        icon: 'none',
      })
      return false
    }
  }

  return {
    cartList,
    checkedList,
    isAllChecked,
    totalPrice,
    totalCount,
    getCartList,
    addToCart,
    addProductToCart,
    updateCount,
    increaseCount,
    decreaseCount,
    toggleChecked,
    toggleAllChecked,
    removeFromCart,
    clearChecked,
    clearCart,
  }
}
