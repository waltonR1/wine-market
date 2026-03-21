export interface ProductItem {
    id: number
    name: string
    subtitle: string
    price: number
    image: string
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
    images?: string[]
}

export interface ProductDetail extends ProductItem {
    region: string
    type: string
    alcohol: string
    description: string
    stock: number
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
