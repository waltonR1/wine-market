import { BASE_URL, REQUEST_TIMEOUT, API_PREFIX, APP_CONFIG } from '@/config/env'
import type { ApiResponse } from '@/types/common'
import { getToken, removeToken } from '@/utils/auth'

interface RequestOptions {
    url: string
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    data?: Record<string, any>
    header?: Record<string, string>
    loading?: boolean // 是否显示加载动画
    loadingText?: string // 加载动画文字
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

        if (APP_CONFIG.ENABLE_LOG) {
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

                if (APP_CONFIG.ENABLE_LOG) {
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
                } else {
                    // 优先展示后端返回的错误信息
                    const errorMsg = (responseData && responseData.message) || '网络请求失败'
                    uni.showToast({
                        title: errorMsg,
                        icon: 'none',
                    })
                    reject(new Error(`请求失败，状态码：${statusCode}，信息：${errorMsg}`))
                }
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
