import { storeToRefs } from 'pinia'
import { useCartStore } from '@/store/cart'
import { getCartList as getCartListApi } from '@/api/modules/cart'
import type { CartItem } from '@/types/model/cart'
import type { ProductItem } from '@/types/model/goods'

export function useCart() {
  const cartStore = useCartStore()
  const { cartList, checkedList, isAllChecked, totalPrice, totalCount } = storeToRefs(cartStore)

  /**
   * 获取购物车列表
   */
  async function getCartList() {
    try {
      const res = await getCartListApi()
      if (res.code === 0) {
        cartStore.cartList = res.data
        return res.data
      }
      uni.showToast({ title: res.message || '购物车加载失败', icon: 'none' })
      return []
    } catch (err) {
      uni.showToast({ title: '购物车加载失败', icon: 'none' })
      return []
    }
  }

  /**
   * 添加到购物车
   */
  function addToCart(goods: CartItem) {
    cartStore.addToCart(goods)
    uni.showToast({ title: '已添加到购物车', icon: 'success' })
  }

  function addProductToCart(product: ProductItem) {
    const goods: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      count: 1,
      checked: true,
      image: product.image,
    }
    addToCart(goods)
  }

  /**
   * 切换商品选中状态
   */
  function toggleChecked(id: number) {
    cartStore.toggleChecked(id)
  }

  /**
   * 切换全选状态
   */
  function toggleAllChecked() {
    cartStore.toggleAllChecked()
  }

  /**
   * 更新商品数量
   */
  function updateCount(id: number, count: number) {
    cartStore.updateCount(id, count)
  }

  function increaseCount(id: number) {
    const target = cartList.value.find(item => item.id === id)
    if (target) {
      updateCount(id, target.count + 1)
    }
  }

  function decreaseCount(id: number) {
    const target = cartList.value.find(item => item.id === id)
    if (target && target.count > 1) {
      updateCount(id, target.count - 1)
    }
  }

  /**
   * 删除商品
   */
  function removeFromCart(id: number) {
    cartStore.removeFromCart(id)
  }

  /**
   * 清空已选商品
   */
  function clearChecked() {
    cartStore.clearChecked()
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
    toggleChecked,
    toggleAllChecked,
    updateCount,
    increaseCount,
    decreaseCount,
    removeFromCart,
    clearChecked,
  }
}
