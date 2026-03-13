import { hasToken } from '@/utils/auth'

export function checkLogin(redirectUrl?: string): boolean {
    if (hasToken()) {
        return true
    }

    uni.showToast({
        title: '请先登录',
        icon: 'none',
    })

    setTimeout(() => {
        let url = '/pages/login/index'

        if (redirectUrl) {
            url += `?redirect=${encodeURIComponent(redirectUrl)}`
        }

        uni.navigateTo({
            url,
        })
    }, 300)

    return false
}