export interface ProductItem {
    id: number
    name: string
    subtitle: string
    price: number
    image: string
    tag?: string
    comment?: number
}

export interface ProductDetail extends ProductItem {
    region: string
    type: string
    alcohol: string
    description: string
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