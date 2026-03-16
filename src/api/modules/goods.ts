import { request } from '@/utils/request'
import { API_PATHS } from '@/config/api'
import type {
    GetFirstCategoryListResponse,
    GetGoodsDetailResponse,
    GetGoodsListResponse,
    GetHomeCategoryListResponse,
    GetHomeProductListResponse,
    GetSecondCategoryMapResponse,
    GoodsListParams,
} from '@/types/api/goods'
import type { ProductItem } from '@/types/model/goods'

export function getHomeCategoryList(): Promise<GetHomeCategoryListResponse> {
    return request({
        url: API_PATHS.HOME_CATEGORIES,
        method: 'GET',
    })
}

export function getHomeProductList(): Promise<GetHomeProductListResponse> {
    return request({
        url: API_PATHS.HOME_PRODUCTS,
        method: 'GET',
    })
}

export function getFirstCategoryList(): Promise<GetFirstCategoryListResponse> {
    return request({
        url: API_PATHS.CATEGORIES_FIRST,
        method: 'GET',
    })
}

export function getSecondCategoryMap(): Promise<GetSecondCategoryMapResponse> {
    return request({
        url: API_PATHS.CATEGORIES_SECOND,
        method: 'GET',
    })
}

export function getGoodsList(params?: GoodsListParams): Promise<GetGoodsListResponse> {
    return request<ProductItem[]>({
        url: API_PATHS.GOODS_LIST,
        method: 'GET',
        data: params,
    })
}

export function getGoodsDetail(id: number): Promise<GetGoodsDetailResponse> {
    return request({
        url: API_PATHS.GOODS_DETAIL(id),
        method: 'GET',
        loading: true,
        loadingText: '正在获取商品详情...',
    })
}
