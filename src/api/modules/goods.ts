import { IS_MOCK } from '@/config/env'
import { request } from '@/utils/request'
import {
    firstCategoryList,
    goodsDetailMap,
    goodsList,
    homeCategoryList,
    homeProductList,
    secondCategoryMap,
} from '@/mock/goods'
import type {
    GetFirstCategoryListResponse,
    GetGoodsDetailResponse,
    GetGoodsListResponse,
    GetHomeCategoryListResponse,
    GetHomeProductListResponse,
    GetSecondCategoryMapResponse,
} from '@/types/api/goods'

export function getHomeCategoryList(): Promise<GetHomeCategoryListResponse> {
    if (IS_MOCK) {
        return Promise.resolve({
            code: 0,
            message: 'ok',
            data: homeCategoryList,
        })
    }

    return request({
        url: '/goods/home/categories',
        method: 'GET',
    })
}

export function getHomeProductList(): Promise<GetHomeProductListResponse> {
    if (IS_MOCK) {
        return Promise.resolve({
            code: 0,
            message: 'ok',
            data: homeProductList,
        })
    }

    return request({
        url: '/goods/home/products',
        method: 'GET',
    })
}

export function getFirstCategoryList(): Promise<GetFirstCategoryListResponse> {
    if (IS_MOCK) {
        return Promise.resolve({
            code: 0,
            message: 'ok',
            data: firstCategoryList,
        })
    }

    return request({
        url: '/goods/categories/first',
        method: 'GET',
    })
}

export function getSecondCategoryMap(): Promise<GetSecondCategoryMapResponse> {
    if (IS_MOCK) {
        return Promise.resolve({
            code: 0,
            message: 'ok',
            data: secondCategoryMap,
        })
    }

    return request({
        url: '/goods/categories/second',
        method: 'GET',
    })
}

export function getGoodsList(): Promise<GetGoodsListResponse> {
    if (IS_MOCK) {
        return Promise.resolve({
            code: 0,
            message: 'ok',
            data: goodsList,
        })
    }

    return request({
        url: '/goods',
        method: 'GET',
    })
}

export function getGoodsDetail(id: number): Promise<GetGoodsDetailResponse> {
    if (IS_MOCK) {
        const detail = goodsDetailMap[id] ?? null

        return Promise.resolve({
            code: detail ? 0 : 404,
            message: detail ? 'ok' : '商品不存在',
            data: detail,
        })
    }

    return request({
        url: `/goods/${id}`,
        method: 'GET',
    })
}