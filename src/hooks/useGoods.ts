import { ref } from 'vue'
import {
  getGoodsList as getGoodsListApi,
  getHomeCategoryList as getHomeCategoryListApi,
  getHomeProductList as getHomeProductListApi,
} from '@/api/modules/goods'
import { IS_MOCK } from '@/config/env'
import type { ProductItem } from '@/types/model/goods'
import type { GoodsListParams } from '@/types/api/goods'

export function useGoods() {
  const loading = ref(false)
  const finished = ref(false)
  const productList = ref<ProductItem[]>([])
  const allProductList = ref<ProductItem[]>([])
  const page = ref(1)
  const pageSize = ref(10)

  async function getHomeCategories() {
    try {
      const res = await getHomeCategoryListApi()
      if (res.code === 0) {
        return res.data
      }
      uni.showToast({ title: res.message || '分类加载失败', icon: 'none' })
      return []
    } catch (err) {
      uni.showToast({ title: '分类加载失败', icon: 'none' })
      return []
    }
  }

  async function getHomeProducts() {
    try {
      const res = await getHomeProductListApi()
      if (res.code === 0) {
        return res.data
      }
      uni.showToast({ title: res.message || '商品加载失败', icon: 'none' })
      return []
    } catch (err) {
      uni.showToast({ title: '商品加载失败', icon: 'none' })
      return []
    }
  }

  function filterAndSortProducts(list: ProductItem[], params: GoodsListParams) {
    let filteredData = list

    if (params.categoryId) {
      filteredData = filteredData.filter((item: any) => item.categoryId === params.categoryId)
    }
    if (params.subCategoryId && params.subCategoryId % 100 !== 1) {
      filteredData = filteredData.filter((item: any) => item.subCategoryId === params.subCategoryId)
    }

    if (params.keyword) {
      const kw = params.keyword.toLowerCase()
      filteredData = filteredData.filter(item =>
        item.name.toLowerCase().includes(kw) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(kw)),
      )
    }

    if (params.sortField && params.sortField !== 'default') {
      const field = params.sortField
      const order = params.sortOrder || 'desc'
      filteredData = [...filteredData].sort((a: any, b: any) => {
        const valA = a[field] || 0
        const valB = b[field] || 0
        return order === 'asc' ? valA - valB : valB - valA
      })
    }

    if (params.minPrice !== undefined) {
      filteredData = filteredData.filter(item => item.price >= params.minPrice!)
    }
    if (params.maxPrice !== undefined) {
      filteredData = filteredData.filter(item => item.price <= params.maxPrice!)
    }

    return filteredData
  }

  async function getGoodsList(params: GoodsListParams = {}, isRefresh = false) {
    if (loading.value || (finished.value && !isRefresh)) return
    
    if (isRefresh) {
      page.value = 1
      finished.value = false
      productList.value = []
      allProductList.value = []
    }

    loading.value = true
    try {
      if (IS_MOCK) {
        if (allProductList.value.length === 0) {
          const fullRes = await getGoodsListApi()
          if (fullRes.code !== 0) {
            uni.showToast({ title: fullRes.message || '加载失败', icon: 'none' })
            return
          }
          allProductList.value = fullRes.data
        }

        const filtered = filterAndSortProducts(allProductList.value, params)
        const start = (page.value - 1) * pageSize.value
        const end = start + pageSize.value
        const pageData = filtered.slice(start, end)

        if (pageData.length < pageSize.value) {
          finished.value = true
        }
        productList.value = [...productList.value, ...pageData]
        page.value++
        return
      }

      const res = await getGoodsListApi({
        ...params,
        page: page.value,
        pageSize: pageSize.value,
      })

      if (res.code !== 0) {
        uni.showToast({ title: res.message || '加载失败', icon: 'none' })
        return
      }

      const data = res.data
      if (data.length < pageSize.value) {
        finished.value = true
      }
      productList.value = [...productList.value, ...data]
      page.value++
    } catch (err) {
      uni.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    finished,
    productList,
    page,
    pageSize,
    getHomeCategories,
    getHomeProducts,
    getGoodsList,
  }
}
