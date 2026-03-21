import { request } from '@/utils/request'
import { API_PATHS } from '@/config/api'
import type {
  GetAddressListResponse,
  GetDefaultAddressResponse,
  CreateAddressRequest,
  CreateAddressResponse,
  UpdateAddressRequest,
  UpdateAddressResponse,
  DeleteAddressResponse,
  SetDefaultAddressResponse,
} from '@/types/api/address'

export function getAddressList(): Promise<GetAddressListResponse> {
  return request({
    url: API_PATHS.ADDRESS_LIST,
    method: 'GET',
  })
}

export function getDefaultAddress(): Promise<GetDefaultAddressResponse> {
  return request({
    url: API_PATHS.ADDRESS_DEFAULT,
    method: 'GET',
  })
}

export function createAddress(data: CreateAddressRequest): Promise<CreateAddressResponse> {
  return request({
    url: API_PATHS.ADDRESS_LIST,
    method: 'POST',
    data,
  })
}

export function updateAddress(id: number, data: UpdateAddressRequest): Promise<UpdateAddressResponse> {
  return request({
    url: API_PATHS.ADDRESS_ITEM(id),
    method: 'POST',
    data,
  })
}

export function deleteAddress(id: number): Promise<DeleteAddressResponse> {
  return request({
    url: API_PATHS.ADDRESS_ITEM(id),
    method: 'DELETE',
  })
}

export function setDefaultAddress(id: number): Promise<SetDefaultAddressResponse> {
  return request({
    url: API_PATHS.ADDRESS_SET_DEFAULT(id),
    method: 'POST',
  })
}
