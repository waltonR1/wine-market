import type { AddressInfo, OrderConfirmItem } from '@/types/model/order'

export const defaultAddress: AddressInfo = {
    name: '张三',
    phone: '13800000000',
    detail: '北京市 朝阳区 酒仙桥路 88号',
}

export const confirmOrderList: OrderConfirmItem[] = [
    {
        id: 1,
        name: 'Château Bordeaux Rouge',
        spec: '法国波尔多干红',
        price: 199,
        count: 1,
        image: '/assets/logo.png',
    },
    {
        id: 2,
        name: 'Champagne Brut Réserve',
        spec: '香槟区起泡酒',
        price: 399,
        count: 1,
        image: '/assets/logo.png',
    },
]