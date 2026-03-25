import { request } from '@/utils/request'
import { API_PATHS } from '@/config/api'
import type {
  GetFirstCategoryListResponse,
  GetGoodsDetailResponse,
  GetGoodsListResponse,
  GetHomeCategoryListResponse,
  GetHomeProductListResponse,
  GetSecondCategoryMapResponse,
  GoodsListParams, HomeCategoryItem,
} from '@/types/api/goods'
import type {FirstCategoryItem, ProductDetail, ProductItem, SecondCategoryItem} from '@/types/model/goods'

export function getHomeCategoryList(): Promise<GetHomeCategoryListResponse> {
  return request<HomeCategoryItem[]>({
    url: API_PATHS.HOME.CATEGORIES,
    method: 'GET',
  })
}

export function getHomeProductList(): Promise<GetHomeProductListResponse> {
  return request<ProductItem[]>({
    url: API_PATHS.HOME.PRODUCTS,
    method: 'GET',
  })
}

export function getFirstCategoryList(): Promise<GetFirstCategoryListResponse> {
  return request<FirstCategoryItem[]>({
    url: API_PATHS.CATEGORY.FIRST,
    method: 'GET',
  })
}

export function getSecondCategoryMap(): Promise<GetSecondCategoryMapResponse> {
  return request<Record<number, SecondCategoryItem[]>>({
    url: API_PATHS.CATEGORY.SECOND,
    method: 'GET',
  })
}

export function getGoodsList(params?: GoodsListParams): Promise<GetGoodsListResponse> {
  return request<ProductItem[]>({
    url: API_PATHS.GOODS.LIST,
    method: 'GET',
    data: params,
  })
}

export function getGoodsDetail(id: number): Promise<GetGoodsDetailResponse> {
  return request<ProductDetail | null>({
    url: API_PATHS.GOODS.DETAIL(id),
    method: 'GET',
    loading: true,
    loadingText: '正在获取商品详情...',
  })
}
