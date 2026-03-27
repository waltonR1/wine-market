import { BASE_URL, REQUEST_TIMEOUT, API_PREFIX } from '@/config/env'
import { APP_CONFIG } from '@/config/app'
import type { ApiResponse } from '@/types/common'
import { getToken, removeToken } from '@/utils/auth'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: Record<string, any>
  header?: Record<string, string>
  loading?: boolean
  loadingText?: string
}

export function request<T>({
  url,
  method = 'GET',
  data,
  header = {},
  loading = false,
  loadingText = '正在加载...',
}: RequestOptions): Promise<ApiResponse<T>> {
  return new Promise((resolve, reject) => {
    const token = getToken()
    const fullUrl = `${BASE_URL}${API_PREFIX}${url}`

    if (APP_CONFIG.COMMON.ENABLE_REQUEST_LOG) {
      console.log(`[Request] ${method} ${fullUrl}`, data)
    }

    if (loading) {
      uni.showLoading({
        title: loadingText,
        mask: true,
      })
    }

    uni.request({
      url: fullUrl,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...header,
      },
      timeout: REQUEST_TIMEOUT,
      success: (res) => {
        const { statusCode, data: responseData } = res as { statusCode: number, data: any }

        if (APP_CONFIG.COMMON.ENABLE_REQUEST_LOG) {
          console.log(`[Response] ${fullUrl}`, responseData)
        }

        if (statusCode === 401) {
          removeToken()

          uni.showToast({
            title: '登录已失效，请重新登录',
            icon: 'none',
          })

          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/login/index',
            })
          }, 300)

          reject(new Error('未登录或登录已失效'))
          return
        }

        if (statusCode >= 200 && statusCode < 300) {
          resolve(responseData as ApiResponse<T>)
          return
        }

        const errorMessage = responseData?.message || '网络请求失败'
        uni.showToast({
          title: errorMessage,
          icon: 'none',
        })
        reject(new Error(errorMessage))
      },
      fail: (error) => {
        uni.showToast({
          title: '网络连接异常',
          icon: 'none',
        })
        reject(error)
      },
      complete: () => {
        if (loading) {
          uni.hideLoading()
        }
      },
    })
  })
}
