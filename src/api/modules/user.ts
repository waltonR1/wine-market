import { request } from '@/utils/request'
import { API_PATHS } from '@/config/api'
import { IS_MOCK } from '@/config/env'
import type {
  GetUserInfoResponse,
  LoginParams,
  LoginResponse, LoginResult,
  WechatLoginResponse,
} from '@/types/api/user'
import type {UserInfo} from "@/types/model/user";

export function login(data: LoginParams): Promise<LoginResponse> {
  return request<LoginResult>({
    url: API_PATHS.USER.LOGIN,
    method: IS_MOCK ? 'GET' : 'POST',
    data,
    loading: true,
    loadingText: '正在登录...',
  })
}

export function wechatLogin(code: string): Promise<WechatLoginResponse> {
  return request<LoginResult>({
    url: API_PATHS.USER.LOGIN,
    method: IS_MOCK ? 'GET' : 'POST',
    data: { code },
    loading: true,
    loadingText: '正在登录...',
  })
}

export function getUserInfo(): Promise<GetUserInfoResponse> {
  return request<UserInfo>({
    url: API_PATHS.USER.INFO,
    method: 'GET',
  })
}
