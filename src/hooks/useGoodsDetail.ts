import { ref } from 'vue'
import { getGoodsDetail as getGoodsDetailApi } from '@/api/modules/goods'
import type { ProductDetail } from '@/types/model/goods'

export function useGoodsDetail() {
  const loading = ref(false)
  const product = ref<ProductDetail | null>(null)

  async function fetchProductDetail(id: number) {
    if (Number.isNaN(id)) {
      uni.showToast({ title: '商品参数错误', icon: 'none' })
      product.value = null
      return null
    }

    loading.value = true
    try {
      const res = await getGoodsDetailApi(id)
      if (res.code === 0 && res.data) {
        product.value = res.data
        return res.data
      }
      uni.showToast({ title: res.message || '商品不存在', icon: 'none' })
      product.value = null
      return null
    } catch (err) {
      uni.showToast({ title: '商品加载失败', icon: 'none' })
      product.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    product,
    fetchProductDetail,
  }
}

