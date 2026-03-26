export interface ProductItem {
    id: number
    name: string
    subtitle: string
    price: number
    image: string
    stock: number
    sales?: number
    tag?: string
    comment?: number
    categoryId?: number
    subCategoryId?: number
}

export interface GoodsDetailBlock {
    type: 'title' | 'text' | 'image'
    value: string
}

export interface GoodsParamItem {
    label: string
    value: string
}

export interface GoodsComment {
    id: number
    userName: string
    avatar: string
    score: number
    content: string
    time: string
    anonymous?: boolean
    orderId?: string
    images?: string[]
    appendTime?: string
    appendContent?: string
    appendImages?: string[]
}

export interface ProductDetail extends ProductItem {
    region: string
    type: string
    alcohol: string
    description: string
    detail: GoodsDetailBlock[]
    params: GoodsParamItem[]
    comments: GoodsComment[]
}

export interface FirstCategoryItem {
    id: number
    name: string
}

export interface SecondCategoryItem {
    id: number
    name: string
    image: string
}
