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

export async function getGoodsList(params?: GoodsListParams): Promise<GetGoodsListResponse> {
    const res = await request<any[]>({
        url: API_PATHS.GOODS_LIST,
        method: 'GET',
    })

    if (res.code === 0 && params) {
        let filteredData = res.data

        // 1. 分类过滤
        if (params.categoryId) {
            filteredData = filteredData.filter(item => item.categoryId === params.categoryId)
        }
        if (params.subCategoryId && params.subCategoryId % 100 !== 1) {
            filteredData = filteredData.filter(item => item.subCategoryId === params.subCategoryId)
        }

        // 2. 关键词搜索 (大数据量下必须由后端完成)
        if (params.keyword) {
            const kw = params.keyword.toLowerCase()
            filteredData = filteredData.filter(item =>
                item.name.toLowerCase().includes(kw) ||
                (item.subtitle && item.subtitle.toLowerCase().includes(kw))
            )
        }

        // 3. 排序 (大数据量下必须由后端完成)
        if (params.sortField && params.sortField !== 'default') {
            const field = params.sortField
            const order = params.sortOrder || 'desc'
            filteredData.sort((a, b) => {
                const valA = a[field] || 0
                const valB = b[field] || 0
                return order === 'asc' ? valA - valB : valB - valA
            })
        }

        // 4. 价格过滤
        if (params.minPrice !== undefined) {
            filteredData = filteredData.filter(item => item.price >= params.minPrice!)
        }
        if (params.maxPrice !== undefined) {
            filteredData = filteredData.filter(item => item.price <= params.maxPrice!)
        }

        // 5. 分页模拟 (核心：大数据量适配关键)
        const page = params.page || 1
        const pageSize = params.pageSize || 10
        const start = (page - 1) * pageSize
        const end = start + pageSize
        
        return {
            ...res,
            data: filteredData.slice(start, end) // 仅返回当前页数据
        }
    }

    return res
}

export function getGoodsDetail(id: number): Promise<GetGoodsDetailResponse> {
    return request({
        url: API_PATHS.GOODS_DETAIL(id),
        method: 'GET',
        loading: true,
        loadingText: '正在获取商品详情...',
    })
}
