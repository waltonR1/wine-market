import { ref } from 'vue'
import {
  getMemberProfile as getMemberProfileApi,
  getWalletInfo as getWalletInfoApi,
  getCoupons as getCouponsApi,
  getFavorites as getFavoritesApi,
  getFootprints as getFootprintsApi,
  getInvoices as getInvoicesApi,
  getPointsHistory as getPointsHistoryApi,
  getRealnameInfo as getRealnameInfoApi,
} from '@/api/modules/member'
import type { MemberProfile, WalletInfo } from '@/types/model/member'

export function useMember() {
  const loading = ref(false)
  const defaultProfile: MemberProfile = {
    nickname: '',
    welcomeText: '',
    favoriteCount: 0,
    pendingPayCount: 0,
    pendingShipCount: 0,
    pendingReceiveCount: 0,
    pendingRateCount: 0,
    returnCount: 0,
    points: 0,
  }
  const defaultWalletInfo: WalletInfo = {
    balance: 0,
    points: 0,
    couponCount: 0,
  }

  const profile = ref<MemberProfile>({ ...defaultProfile })
  const walletInfo = ref<WalletInfo>({ ...defaultWalletInfo })

  async function fetchProfile() {
    loading.value = true
    try {
      const res = await getMemberProfileApi()
      if (res.code === 0) {
        profile.value = res.data
        return res.data
      }
      uni.showToast({ title: res.message || '个人信息加载失败', icon: 'none' })
      return null
    } catch (err) {
      uni.showToast({ title: '个人信息加载失败', icon: 'none' })
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchWalletInfo() {
    loading.value = true
    try {
      const res = await getWalletInfoApi()
      if (res.code === 0) {
        walletInfo.value = res.data
        return res.data
      }
      uni.showToast({ title: res.message || '获取钱包信息失败', icon: 'none' })
      return null
    } catch (err) {
      uni.showToast({ title: '获取钱包信息失败', icon: 'none' })
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchCoupons() {
    try {
      const res = await getCouponsApi()
      if (res.code === 0) return res.data
      uni.showToast({ title: res.message || '获取优惠券失败', icon: 'none' })
      return []
    } catch (err) {
      uni.showToast({ title: '获取优惠券失败', icon: 'none' })
      return []
    }
  }

  async function fetchPointsHistory() {
    try {
      const res = await getPointsHistoryApi()
      if (res.code === 0) return res.data
      uni.showToast({ title: res.message || '获取积分记录失败', icon: 'none' })
      return []
    } catch (err) {
      uni.showToast({ title: '获取积分记录失败', icon: 'none' })
      return []
    }
  }

  async function fetchFavorites() {
    try {
      const res = await getFavoritesApi()
      if (res.code === 0) return res.data
      uni.showToast({ title: res.message || '获取收藏失败', icon: 'none' })
      return []
    } catch (err) {
      uni.showToast({ title: '获取收藏失败', icon: 'none' })
      return []
    }
  }

  async function fetchFootprints() {
    try {
      const res = await getFootprintsApi()
      if (res.code === 0) return res.data
      uni.showToast({ title: res.message || '获取足迹失败', icon: 'none' })
      return []
    } catch (err) {
      uni.showToast({ title: '获取足迹失败', icon: 'none' })
      return []
    }
  }

  async function fetchRealnameInfo() {
    try {
      const res = await getRealnameInfoApi()
      if (res.code === 0) return res.data
      uni.showToast({ title: res.message || '获取实名信息失败', icon: 'none' })
      return null
    } catch (err) {
      uni.showToast({ title: '获取实名信息失败', icon: 'none' })
      return null
    }
  }

  async function fetchInvoices() {
    try {
      const res = await getInvoicesApi()
      if (res.code === 0) return res.data
      uni.showToast({ title: res.message || '获取发票失败', icon: 'none' })
      return []
    } catch (err) {
      uni.showToast({ title: '获取发票失败', icon: 'none' })
      return []
    }
  }

  function reset() {
    profile.value = { ...defaultProfile }
    walletInfo.value = { ...defaultWalletInfo }
  }

  return {
    loading,
    profile,
    walletInfo,
    fetchProfile,
    fetchWalletInfo,
    fetchCoupons,
    fetchPointsHistory,
    fetchFavorites,
    fetchFootprints,
    fetchRealnameInfo,
    fetchInvoices,
    reset,
  }
}
