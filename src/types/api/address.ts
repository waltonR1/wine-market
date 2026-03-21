import type { ApiResponse } from '@/types/common'
import type { AddressInfo } from '@/types/model/address'

export type GetAddressListResponse = ApiResponse<AddressInfo[]>

export type GetDefaultAddressResponse = ApiResponse<AddressInfo | null>

export interface CreateAddressRequest {
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault?: boolean
}

export type CreateAddressResponse = ApiResponse<AddressInfo[]>

export type UpdateAddressRequest = CreateAddressRequest

export type UpdateAddressResponse = ApiResponse<AddressInfo[]>

export type DeleteAddressResponse = ApiResponse<AddressInfo[]>

export type SetDefaultAddressResponse = ApiResponse<AddressInfo[]>
