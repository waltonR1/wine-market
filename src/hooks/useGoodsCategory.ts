import { computed, ref } from 'vue'
import { getFirstCategoryList as getFirstCategoryListApi, getSecondCategoryMap as getSecondCategoryMapApi } from '@/api/modules/goods'
import type { FirstCategoryItem, SecondCategoryItem } from '@/types/model/goods'

export function useGoodsCategory() {
  const loading = ref(false)
  const activeFirstId = ref(1)
  const firstCategoryList = ref<FirstCategoryItem[]>([])
  const secondCategoryMap = ref<Record<number, SecondCategoryItem[]>>({})

  const currentSecondList = computed(() => {
    return secondCategoryMap.value[activeFirstId.value] || []
  })

  async function fetchCategories() {
    loading.value = true
    try {
      const [firstRes, secondRes] = await Promise.all([
        getFirstCategoryListApi(),
        getSecondCategoryMapApi(),
      ])

      if (firstRes.code === 0) {
        firstCategoryList.value = firstRes.data
        if (firstCategoryList.value.length > 0) {
          activeFirstId.value = firstCategoryList.value[0].id
        }
      } else {
        uni.showToast({ title: firstRes.message || '一级分类加载失败', icon: 'none' })
      }

      if (secondRes.code === 0) {
        secondCategoryMap.value = secondRes.data
      } else {
        uni.showToast({ title: secondRes.message || '二级分类加载失败', icon: 'none' })
      }
    } catch (err) {
      uni.showToast({ title: '分类加载失败', icon: 'none' })
    } finally {
      loading.value = false
    }
  }

  function changeFirst(id: number) {
    activeFirstId.value = id
  }

  return {
    loading,
    activeFirstId,
    firstCategoryList,
    secondCategoryMap,
    currentSecondList,
    fetchCategories,
    changeFirst,
  }
}

