import { BASE_URL, REQUEST_TIMEOUT } from '@/config/env'
import type { ApiResponse } from '@/types/common'
import { getToken, removeToken } from '@/utils/auth'

interface RequestOptions {
    url: string
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    data?: Record<string, any>
    header?: Record<string, string>
}

export function request<T>({
                               url,
                               method = 'GET',
                               data,
                               header = {},
                           }: RequestOptions): Promise<ApiResponse<T>> {
    return new Promise((resolve, reject) => {
        const token = getToken()

        uni.request({
            url: `${BASE_URL}${url}`,
            method,
            data,
            header: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...header,
            },
            timeout: REQUEST_TIMEOUT,
            success: (res) => {
                const { statusCode, data: responseData } = res

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
                    uni.showToast({
                        title: '网络请求失败',
                        icon: 'none',
                    })
                    reject(new Error(`请求失败，状态码：${statusCode}`))
                }
            },
            fail: (error) => {
                uni.showToast({
                    title: '网络连接异常',
                    icon: 'none',
                })
                reject(error)
            },
        })
    })
}