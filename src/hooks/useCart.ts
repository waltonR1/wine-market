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
   * 用接口返回的数据统一同步 store。
   */
  function syncCartList(list: CartItem[]) {
    cartStore.setCartList(list)
  }

  /**
   * 将服务端购物车数据转换成前端使用的 CartItem，
   * 并尽量保留当前本地的勾选状态。
   */
  function toClientList(serverList: CartServerItem[] | undefined, current: CartItem[]) {
    const checkedMap = new Map<number, boolean>()
    current.forEach(item => checkedMap.set(item.id, item.checked))

    return (serverList || []).map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      count: item.count,
      image: item.image,
      stock: item.stock,
      checked: checkedMap.get(item.id) ?? true,
    }))
  }

  /**
   * 获取购物车列表。
   * 未登录时直接使用本地购物车；
   * 已登录时拉取服务端数据并同步到 store。
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
   * 添加到购物车。
   * 未登录只更新本地；
   * 已登录时先乐观更新，失败后回滚。
   */
  async function addToCart(goods: CartItem) {
    const oldList = cartList.value.map(item => ({ ...item }))

    cartStore.addToCart(goods)

    if (!isLogin.value) {
      uni.showToast({
        title: '已加入购物车',
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
        if (APP_CONFIG.COMMON.USE_SERVER_CART_SYNC) {
          syncCartList(toClientList(res.data, cartList.value))
        }

        uni.showToast({
          title: '已加入购物车',
          icon: 'success',
        })
        return true
      }

      cartStore.setCartList(oldList)
      uni.showToast({
        title: res.message || '加入失败',
        icon: 'none',
      })
      return false
    } catch (error) {
      cartStore.setCartList(oldList)
      uni.showToast({
        title: '加入失败',
        icon: 'none',
      })
      return false
    }
  }

  /**
   * 从商品详情添加到购物车。
   */
  async function addProductToCart(product: ProductItem) {
    if (!APP_CONFIG.COMMON.ALLOW_ADD_OUT_OF_STOCK) {
      if (product.stock <= 0) {
        uni.showToast({
          title: '该商品已售罄',
          icon: 'none',
        })
        return false
      }
    }

    const goods: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      count: 1,
      checked: true,
      image: product.image,
      stock: product.stock,
    }

    return addToCart(goods)
  }

  /**
   * 更新商品数量。
   */
  async function updateCount(id: number, count: number) {
    const target = cartList.value.find(item => item.id === id)
    if (!target) return false

    const oldCount = target.count

    if (oldCount === count) {
      return true
    }

    if (count < 1) {
      uni.showToast({
        title: '商品数量不能小于 1',
        icon: 'none',
      })
      return false
    }

    if (count > target.stock) {
      uni.showToast({
        title: '已达到库存上限',
        icon: 'none',
      })
      return false
    }

    cartStore.updateCount(id, count)

    if (!isLogin.value) {
      return true
    }

    try {
      const res = await updateCartItemCount({ id, count })

      if (res.code === 0) {
        syncCartList(toClientList(res.data, cartList.value))
        return true
      }

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
   * 数量 +1。
   */
  async function increaseCount(id: number) {
    const target = cartList.value.find(item => item.id === id)
    if (!target) return false

    return updateCount(id, target.count + 1)
  }

  /**
   * 数量 -1。
   */
  async function decreaseCount(id: number) {
    const target = cartList.value.find(item => item.id === id)
    if (!target || target.count <= 1) return false

    return updateCount(id, target.count - 1)
  }

  /**
   * 切换单个商品勾选状态。
   */
  async function toggleChecked(id: number) {
    const target = cartList.value.find(item => item.id === id)
    if (!target) return false

    cartStore.toggleChecked(id)
    return true
  }

  /**
   * 切换全选状态。
   */
  async function toggleAllChecked() {
    cartStore.toggleAllChecked()
    return true
  }

  function setCheckedItems(ids: number[], exclusive = false) {
    cartStore.setCheckedByIds(ids, exclusive)
  }

  async function refreshCartWithCheckedIds(ids: number[], exclusive = false) {
    const nextList = await getCartList()
    if (nextList.length === 0) {
      return nextList
    }

    cartStore.setCheckedByIds(ids, exclusive)
    return cartList.value
  }

  /**
   * 删除单个商品。
   */
  async function removeFromCart(id: number) {
    const target = cartList.value.find(item => item.id === id)
    if (!target) return false

    const oldList = cartList.value.map(item => ({ ...item }))

    cartStore.removeFromCart(id)

    if (!isLogin.value) {
      return true
    }

    try {
      const res = await deleteCartItem(id)

      if (res.code === 0) {
        syncCartList(toClientList(res.data, cartList.value))
        return true
      }

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
   * 删除已勾选商品。
   */
  async function clearChecked() {
    const ids = checkedList.value.map(item => item.id)

    if (ids.length === 0) {
      return false
    }

    const oldList = cartList.value.map(item => ({ ...item }))

    cartStore.clearChecked()

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
   * 清空购物车。
   */
  async function clearCart() {
    const oldList = cartList.value.map(item => ({ ...item }))
    const ids = oldList.map(item => item.id)

    cartStore.resetCart()

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
    setCheckedItems,
    refreshCartWithCheckedIds,
    removeFromCart,
    clearChecked,
    clearCart,
  }
}
