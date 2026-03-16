import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem } from '@/types/model/cart'

export const useCartStore = defineStore('cart', () => {
  const cartList = ref<CartItem[]>([])

  // 全选状态
  const isAllChecked = computed(() => {
    return cartList.value.length > 0 && cartList.value.every(item => item.checked)
  })

  // 选中的商品列表
  const checkedList = computed(() => {
    return cartList.value.filter(item => item.checked)
  })

  // 总价
  const totalPrice = computed(() => {
    return checkedList.value.reduce((total, item) => total + item.price * item.count, 0)
  })

  // 总数量
  const totalCount = computed(() => {
    return checkedList.value.reduce((total, item) => total + item.count, 0)
  })

  // 添加商品
  function addToCart(goods: CartItem) {
    const index = cartList.value.findIndex(item => item.id === goods.id)
    if (index > -1) {
      cartList.value[index].count += goods.count
    } else {
      cartList.value.push(goods)
    }
  }

  // 更新商品数量
  function updateCount(id: number, count: number) {
    const item = cartList.value.find(item => item.id === id)
    if (item) {
      item.count = count
    }
  }

  // 切换商品选中状态
  function toggleChecked(id: number) {
    const item = cartList.value.find(item => item.id === id)
    if (item) {
      item.checked = !item.checked
    }
  }

  // 切换全选状态
  function toggleAllChecked() {
    const val = !isAllChecked.value
    cartList.value.forEach(item => {
      item.checked = val
    })
  }

  // 删除商品
  function removeFromCart(id: number) {
    const index = cartList.value.findIndex(item => item.id === id)
    if (index > -1) {
      cartList.value.splice(index, 1)
    }
  }

  // 清空已选商品
  function clearChecked() {
    cartList.value = cartList.value.filter(item => !item.checked)
  }

  return {
    cartList,
    isAllChecked,
    checkedList,
    totalPrice,
    totalCount,
    addToCart,
    updateCount,
    toggleChecked,
    toggleAllChecked,
    removeFromCart,
    clearChecked,
  }
})
