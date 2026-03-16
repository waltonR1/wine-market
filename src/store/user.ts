import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/types/model/user'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'

const TOKEN_KEY = 'wine_market_token'
const USER_INFO_KEY = 'wine_market_user_info'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(getStorage(TOKEN_KEY) || '')
  const userInfo = ref<UserInfo | null>(getStorage(USER_INFO_KEY) || null)

  const isLogin = computed(() => !!token.value)

  function setToken(val: string) {
    token.value = val
    setStorage(TOKEN_KEY, val)
  }

  function setUserInfo(val: UserInfo) {
    userInfo.value = val
    setStorage(USER_INFO_KEY, val)
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    removeStorage(TOKEN_KEY)
    removeStorage(USER_INFO_KEY)
  }

  return {
    token,
    userInfo,
    isLogin,
    setToken,
    setUserInfo,
    logout,
  }
})
