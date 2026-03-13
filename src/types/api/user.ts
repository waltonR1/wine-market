import type { ApiResponse } from '@/types/common'
import type { UserInfo } from '@/types/model/user'

export interface LoginParams {
    username: string
    password: string
}

export interface LoginResult {
    token: string
    userInfo: UserInfo
}

export interface WechatLoginParams {
    code: string
}

export type LoginResponse = ApiResponse<LoginResult>
export type WechatLoginResponse = ApiResponse<LoginResult>
export type GetUserInfoResponse = ApiResponse<UserInfo>