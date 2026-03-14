import type { ApiResponse } from '@/types/common'
import type {
    FirstCategoryItem,
    ProductDetail,
    ProductItem,
    SecondCategoryItem,
} from '@/types/model/goods'

export interface HomeCategoryItem {
    id: number
    name: string
    icon: string
}

export type GetHomeCategoryListResponse = ApiResponse<HomeCategoryItem[]>

export type GetHomeProductListResponse = ApiResponse<ProductItem[]>

export type GetFirstCategoryListResponse = ApiResponse<FirstCategoryItem[]>

export type GetSecondCategoryMapResponse = ApiResponse<Record<number, SecondCategoryItem[]>>

export type GetGoodsListResponse = ApiResponse<ProductItem[]>

export interface GoodsListParams {
    categoryId?: number
    subCategoryId?: number
    keyword?: string
    sortField?: 'price' | 'sales' | 'default'
    sortOrder?: 'asc' | 'desc'
    minPrice?: number
    maxPrice?: number
    page?: number
    pageSize?: number
}

export type GetGoodsDetailResponse = ApiResponse<ProductDetail | null>