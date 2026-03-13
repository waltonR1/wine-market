import { IS_MOCK } from '@/config/env'
import { request } from '@/utils/request'
import { mockLoginResult, mockUserInfo } from '@/mock/user'
import type {
    GetUserInfoResponse,
    LoginParams,
    LoginResponse,
    WechatLoginResponse,
} from '@/types/api/user'

export function login(data: LoginParams): Promise<LoginResponse> {
    if (IS_MOCK) {
        const { username, password } = data

        if (username === 'admin' && password === '123456') {
            return Promise.resolve({
                code: 0,
                message: 'ok',
                data: mockLoginResult,
            })
        }

        return Promise.resolve({
            code: 400,
            message: '用户名或密码错误',
            data: {
                token: '',
                userInfo: mockUserInfo,
            },
        })
    }

    return request({
        url: '/user/login',
        method: 'POST',
        data,
    })
}

export function wechatLogin(code: string): Promise<WechatLoginResponse> {
    if (IS_MOCK) {
        return Promise.resolve({
            code: 0,
            message: 'ok',
            data: mockLoginResult,
        })
    }

    return request({
        url: '/user/wechat-login',
        method: 'POST',
        data: { code },
    })
}

export function getUserInfo(): Promise<GetUserInfoResponse> {
    if (IS_MOCK) {
        return Promise.resolve({
            code: 0,
            message: 'ok',
            data: mockUserInfo,
        })
    }

    return request({
        url: '/user/info',
        method: 'GET',
    })
}