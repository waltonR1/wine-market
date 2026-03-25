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
import type {AddressInfo} from "@/types/model/address";

export function getAddressList(): Promise<GetAddressListResponse> {
  return request<AddressInfo[]>({
    url: API_PATHS.ADDRESS.LIST,
    method: 'GET',
  })
}

export function getDefaultAddress(): Promise<GetDefaultAddressResponse> {
  return request<AddressInfo | null>({
    url: API_PATHS.ADDRESS.DEFAULT,
    method: 'GET',
  })
}

export function createAddress(data: CreateAddressRequest): Promise<CreateAddressResponse> {
  return request<AddressInfo[]>({
    url: API_PATHS.ADDRESS.CREATE,
    method: 'POST',
    data,
  })
}

export function updateAddress(id: number, data: UpdateAddressRequest): Promise<UpdateAddressResponse> {
  return request<AddressInfo[]>({
    url: API_PATHS.ADDRESS.ITEM(id),
    method: 'POST',
    data,
  })
}

export function deleteAddress(id: number): Promise<DeleteAddressResponse> {
  return request<AddressInfo[]>({
    url: API_PATHS.ADDRESS.ITEM(id),
    method: 'DELETE',
  })
}

export function setDefaultAddress(id: number): Promise<SetDefaultAddressResponse> {
  return request<AddressInfo[]>({
    url: API_PATHS.ADDRESS.SET_DEFAULT(id),
    method: 'POST',
  })
}
