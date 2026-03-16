import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/user'
import { login as loginApi, wechatLogin as wechatLoginApi, getUserInfo as getUserInfoApi } from '@/api/modules/user'
import type { LoginParams } from '@/types/api/user'

export function useUser() {
  const userStore = useUserStore()
  const { isLogin, userInfo } = storeToRefs(userStore)

  /**
   * 登录
   */
  async function login(params: LoginParams) {
    try {
      const res = await loginApi(params)
      if (res.code === 0) {
        userStore.setToken(res.data.token)
        userStore.setUserInfo(res.data.userInfo)
        uni.showToast({ title: '登录成功', icon: 'success' })
        return true
      }
      uni.showToast({ title: res.message || '登录失败', icon: 'none' })
      return false
    } catch (err) {
      uni.showToast({ title: '登录请求失败', icon: 'none' })
      return false
    }
  }

  async function wechatLogin(code: string) {
    try {
      const res = await wechatLoginApi(code)
      if (res.code === 0) {
        userStore.setToken(res.data.token)
        userStore.setUserInfo(res.data.userInfo)
        uni.showToast({ title: '登录成功', icon: 'success' })
        return true
      }
      uni.showToast({ title: res.message || '登录失败', icon: 'none' })
      return false
    } catch (err) {
      uni.showToast({ title: '微信登录失败', icon: 'none' })
      return false
    }
  }

  /**
   * 获取用户信息
   */
  async function getUserInfo() {
    try {
      const res = await getUserInfoApi()
      if (res.code === 0) {
        userStore.setUserInfo(res.data)
        return res.data
      }
      return null
    } catch (err) {
      return null
    }
  }

  /**
   * 退出登录
   */
  function logout(options: { redirectUrl?: string, reLaunch?: boolean } = {}) {
    const { redirectUrl = '/pages/login/index', reLaunch = true } = options
    userStore.logout()
    uni.showToast({ title: '已退出登录', icon: 'success' })
    if (reLaunch) {
      uni.reLaunch({ url: redirectUrl })
    }
  }

  return {
    isLogin,
    userInfo,
    login,
    wechatLogin,
    getUserInfo,
    logout,
  }
}
