import { request } from '@/utils/request'
import { API_PATHS } from '@/config/api'
import type { GetMemberProfileResponse, GetWalletResponse } from '@/types/api/member'
import type {MemberProfile, WalletInfo} from "@/types/model/member";

export function getMemberProfile(): Promise<GetMemberProfileResponse> {
  return request<MemberProfile>({
    url: API_PATHS.MEMBER.PROFILE,
    method: 'GET',
  })
}

export function getWalletInfo(): Promise<GetWalletResponse> {
  return request<WalletInfo>({
    url: API_PATHS.MEMBER.WALLET,
    method: 'GET',
  })
}

export function getCoupons(): Promise<any> {
  return request({
    url: API_PATHS.MEMBER.COUPONS,
    method: 'GET',
  })
}

export function getPointsHistory(): Promise<any> {
  return request({
    url: API_PATHS.MEMBER.POINTS_HISTORY,
    method: 'GET',
  })
}

export function getFavorites(): Promise<any> {
  return request({
    url: API_PATHS.MEMBER.FAVORITES,
    method: 'GET',
  })
}

export function getFootprints(): Promise<any> {
  return request({
    url: API_PATHS.MEMBER.FOOTPRINTS,
    method: 'GET',
  })
}

export function getRealnameInfo(): Promise<any> {
  return request({
    url: API_PATHS.MEMBER.REALNAME,
    method: 'GET',
  })
}

export function getInvoices(): Promise<any> {
  return request({
    url: API_PATHS.MEMBER.INVOICES,
    method: 'GET',
  })
}
