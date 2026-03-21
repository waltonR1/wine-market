import { reactive, ref } from 'vue'
import type { AddressInfo, AddressFormModel } from '@/types/model/address'
import {
  createAddress,
  deleteAddress,
  getAddressList,
  setDefaultAddress,
  updateAddress,
} from '@/api/modules/address'
import {
  isEmpty,
  isPhone,
  isRealName,
  hasText,
  isAreaName,
  isAddressDetail,
} from '@/utils/validate'

export function useAddress() {
  const addressList = ref<AddressInfo[]>([])
  const loading = ref(false)

  const formVisible = ref(false)
  const isEdit = ref(false)
  const editingId = ref<number | null>(null)

  const form = reactive<AddressFormModel>({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false,
  })

  function normalizeDefaultAddress(list: AddressInfo[]): AddressInfo[] {
    if (list.length === 0) return []

    const firstDefaultIndex = list.findIndex(item => item.isDefault)

    if (firstDefaultIndex === -1) {
      return list.map((item, index) => ({
        ...item,
        isDefault: index === 0,
      }))
    }

    return list.map((item, index) => ({
      ...item,
      isDefault: index === firstDefaultIndex,
    }))
  }

  async function fetchList() {
    loading.value = true
    try {
      const res = await getAddressList()
      if (res.code === 0) {
        addressList.value = normalizeDefaultAddress(res.data)
        return
      }
      uni.showToast({ title: res.message || '获取地址列表失败', icon: 'none' })
    } catch {
      uni.showToast({ title: '获取地址列表失败', icon: 'none' })
    } finally {
      loading.value = false
    }
  }

  function resetForm() {
    form.name = ''
    form.phone = ''
    form.province = ''
    form.city = ''
    form.district = ''
    form.detail = ''
    form.isDefault = false
    editingId.value = null
  }

  function openAdd() {
    resetForm()
    isEdit.value = false
    formVisible.value = true
  }

  function openEdit(item: AddressInfo) {
    isEdit.value = true
    editingId.value = item.id
    form.name = item.name
    form.phone = item.phone
    form.province = item.province
    form.city = item.city
    form.district = item.district
    form.detail = item.detail
    form.isDefault = item.isDefault
    formVisible.value = true
  }

  function closeForm() {
    formVisible.value = false
    resetForm()
    isEdit.value = false
  }

  function setFormDefault(val: boolean) {
    form.isDefault = val
  }

  function setRegion(region: string[]) {
    form.province = region[0] || ''
    form.city = region[1] || ''
    form.district = region[2] || ''
  }

  function validateForm() {
    const name = form.name.trim()
    const phone = form.phone.trim()
    const province = form.province.trim()
    const city = form.city.trim()
    const district = form.district.trim()
    const detail = form.detail.trim()

    if (isEmpty(name)) return '请填写收货人'
    if (!isRealName(name)) return '收货人格式不正确'
    if (!hasText(name)) return '收货人姓名不能全为数字'

    if (isEmpty(phone)) return '请填写手机号'
    if (!isPhone(phone)) return '手机号格式不正确'

    if (isEmpty(province)) return '请选择省份'
    if (!isAreaName(province)) return '省份格式不正确'

    if (isEmpty(city)) return '请选择城市'
    if (!isAreaName(city)) return '城市格式不正确'

    if (isEmpty(district)) return '请选择区县'
    if (!isAreaName(district)) return '区县格式不正确'

    if (isEmpty(detail)) return '请填写详细地址'
    if (!isAddressDetail(detail)) return '详细地址长度应为 5~100 个字符'

    return ''
  }

  async function submitForm() {
    const error = validateForm()
    if (error) {
      uni.showToast({ title: error, icon: 'none' })
      return false
    }

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      province: form.province.trim(),
      city: form.city.trim(),
      district: form.district.trim(),
      detail: form.detail.trim(),
      isDefault: form.isDefault,
    }

    try {
      const res =
        isEdit.value && editingId.value !== null
          ? await updateAddress(editingId.value, payload)
          : await createAddress(payload)

      if (res.code === 0) {
        addressList.value = normalizeDefaultAddress(res.data)
        formVisible.value = false
        resetForm()
        isEdit.value = false
        uni.showToast({ title: '保存成功', icon: 'success' })
        return true
      }

      uni.showToast({ title: res.message || '保存失败', icon: 'none' })
      return false
    } catch {
      uni.showToast({ title: '保存失败', icon: 'none' })
      return false
    }
  }

  async function remove(item: AddressInfo) {
    try {
      const res = await deleteAddress(item.id)
      if (res.code === 0) {
        addressList.value = normalizeDefaultAddress(res.data)
        uni.showToast({ title: '删除成功', icon: 'success' })
        return true
      }
      uni.showToast({ title: res.message || '删除失败', icon: 'none' })
      return false
    } catch {
      uni.showToast({ title: '删除失败', icon: 'none' })
      return false
    }
  }

  async function setDefault(item: AddressInfo) {
    try {
      const res = await setDefaultAddress(item.id)
      if (res.code === 0) {
        addressList.value = normalizeDefaultAddress(res.data)
        uni.showToast({ title: '默认地址已更新', icon: 'success' })
        return true
      }
      uni.showToast({ title: res.message || '设置默认地址失败', icon: 'none' })
      return false
    } catch {
      uni.showToast({ title: '设置默认地址失败', icon: 'none' })
      return false
    }
  }

  return {
    addressList,
    loading,
    formVisible,
    isEdit,
    form,
    fetchList,
    openAdd,
    openEdit,
    closeForm,
    setFormDefault,
    setRegion,
    submitForm,
    remove,
    setDefault,
  }
}
