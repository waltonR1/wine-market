import { request } from '@/utils/request'
import { API_PATHS } from '@/config/api'
import { IS_MOCK } from '@/config/env'
import type {
    GetUserInfoResponse,
    LoginParams,
    LoginResponse,
    WechatLoginResponse,
} from '@/types/api/user'

export function login(data: LoginParams): Promise<LoginResponse> {
    return request({
        url: API_PATHS.USER_LOGIN,
        method: IS_MOCK ? 'GET' : 'POST',
        data,
        loading: true,
        loadingText: '正在登录...',
    })
}

export function wechatLogin(code: string): Promise<WechatLoginResponse> {
    return request({
        url: API_PATHS.USER_LOGIN,
        method: IS_MOCK ? 'GET' : 'POST',
        data: { code },
        loading: true,
        loadingText: '正在登录...',
    })
}

export function getUserInfo(): Promise<GetUserInfoResponse> {
    return request({
        url: API_PATHS.USER_INFO,
        method: 'GET',
    })
}
