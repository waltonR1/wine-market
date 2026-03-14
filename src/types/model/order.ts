export interface OrderItem {
    id: string
    orderNum: string
    status: number
    statusLabel: string
    createTime: string
    totalPrice: number
    totalCount: number
    goods: OrderGoodsItem[]
}

export interface OrderGoodsItem {
    id: number
    name: string
    image: string
    price: number
    count: number
}

export interface OrderConfirmItem {
    id: number
    name: string
    spec: string
    price: number
    count: number
    image: string
}

export interface AddressInfo {
    id: number
    name: string
    phone: string
    province: string
    city: string
    district: string
    detail: string
    isDefault: boolean
}