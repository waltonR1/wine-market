import { storeToRefs } from 'pinia'
import { useCartStore } from '@/store/cart'
import { useUser } from '@/hooks/useUser'
import {
  getCartList as getCartListApi,
  addCartItem,
  updateCartItemCount,
  updateCartItemChecked,
  updateCartAllChecked,
  deleteCartItem,
  batchDeleteCartItems,
  clearCart as clearCartApi,
} from '@/api/modules/cart'

import type { CartItem } from '@/types/model/cart'
import type { ProductItem } from '@/types/model/goods'

export function useCart() {
  const cartStore = useCartStore()
  const { isLogin } = useUser()

  const { cartList, checkedList, isAllChecked, totalPrice, totalCount } = storeToRefs(cartStore)

  /**
   * 用接口返回的数据统一同步 store
   */
  function syncCartList(list: CartItem[] | undefined) {
    cartStore.setCartList(list || [])
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
        syncCartList(res.data)
        return res.data || []
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
        // 这里可选：如果你希望以后端为准，可以打开下一行
        // syncCartList(res.data)

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

    const nextChecked = !target.checked

    // 先本地更新
    cartStore.toggleChecked(id)

    // 未登录时只改本地
    if (!isLogin.value) {
      return true
    }

    try {
      const res = await updateCartItemChecked({
        id,
        checked: nextChecked,
      })

      if (res.code === 0) {
        return true
      }

      // 失败回滚
      cartStore.toggleChecked(id)
      uni.showToast({
        title: res.message || '更新选中状态失败',
        icon: 'none',
      })
      return false
    } catch (error) {
      cartStore.toggleChecked(id)
      uni.showToast({
        title: '更新选中状态失败',
        icon: 'none',
      })
      return false
    }
  }

  /**
   * 切换全选状态
   * 未登录：只更新本地
   * 已登录：乐观更新 + 失败回滚
   */
  async function toggleAllChecked() {
    const nextChecked = !isAllChecked.value
    const oldList = cartList.value.map(item => ({ ...item }))

    // 先本地更新
    cartStore.toggleAllChecked()

    // 未登录时只改本地
    if (!isLogin.value) {
      return true
    }

    try {
      const res = await updateCartAllChecked({
        checked: nextChecked,
      })

      if (res.code === 0) {
        return true
      }

      // 失败回滚
      cartStore.setCartList(oldList)
      uni.showToast({
        title: res.message || '全选状态更新失败',
        icon: 'none',
      })
      return false
    } catch (error) {
      cartStore.setCartList(oldList)
      uni.showToast({
        title: '全选状态更新失败',
        icon: 'none',
      })
      return false
    }
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
      const res = await deleteCartItem({ id })

      if (res.code === 0) {
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
      const res = await batchDeleteCartItems({ ids })

      if (res.code === 0) {
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
   * 清空购物车
   * 未登录：只清本地
   * 已登录：先清本地，再同步后端，失败回滚
   */
  async function clearCart() {
    const oldList = cartList.value.map(item => ({ ...item }))

    // 先本地清空
    cartStore.resetCart()

    // 未登录时只改本地
    if (!isLogin.value) {
      return true
    }

    try {
      const res = await clearCartApi()

      if (res.code === 0) {
        return true
      }

      // 失败回滚
      cartStore.setCartList(oldList)
      uni.showToast({
        title: res.message || '清空购物车失败',
        icon: 'none',
      })
      return false
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
