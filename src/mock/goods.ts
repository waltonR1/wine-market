import type {
    FirstCategoryItem,
    ProductDetail,
    ProductItem,
    SecondCategoryItem,
} from '@/types/model/goods'

export const homeCategoryList = [
    { id: 1, name: '红酒', icon: '🍷' },
    { id: 2, name: '白葡萄酒', icon: '🥂' },
    { id: 3, name: '香槟', icon: '🍾' },
    { id: 4, name: '烈酒', icon: '🥃' },
]

export const homeProductList: ProductItem[] = [
    {
        id: 1,
        name: 'Château Bordeaux Rouge',
        subtitle: '法国波尔多干红',
        price: 199,
        image: '/assets/logo.png',
        tag: '精选',
        comment: 13,
    },
    {
        id: 2,
        name: 'Champagne Brut Réserve',
        subtitle: '香槟区起泡酒',
        price: 399,
        image: '/assets/logo.png',
        tag: '热门',
        comment: 11,
    },
    {
        id: 3,
        name: 'Bourgogne Chardonnay',
        subtitle: '勃艮第霞多丽',
        price: 268,
        image: '/assets/logo.png',
        tag: '白葡萄酒',
        comment: 9,
    },
    {
        id: 4,
        name: 'Single Malt Whisky',
        subtitle: '单一麦芽威士忌',
        price: 528,
        image: '/assets/logo.png',
        tag: '烈酒',
        comment: 7,
    },
]

export const firstCategoryList: FirstCategoryItem[] = [
    { id: 1, name: '干红' },
    { id: 2, name: '礼盒' },
    { id: 3, name: '干白' },
    { id: 4, name: '甜白' },
    { id: 5, name: '烈酒' },
    { id: 6, name: '无醇' },
    { id: 7, name: '世界名庄' },
    { id: 8, name: '促销活动' },
    { id: 9, name: '香槟 起泡酒' },
]

export const secondCategoryMap: Record<number, SecondCategoryItem[]> = {
    1: [
        { id: 101, name: '所有干红', image: '/assets/logo.png' },
        { id: 102, name: '波尔多产区', image: '/assets/logo.png' },
        { id: 103, name: '罗纳河谷', image: '/assets/logo.png' },
        { id: 104, name: '其他产区', image: '/assets/logo.png' },
        { id: 105, name: '勃艮第', image: '/assets/logo.png' },
    ],
    2: [
        { id: 201, name: '节日礼盒', image: '/assets/logo.png' },
        { id: 202, name: '商务送礼', image: '/assets/logo.png' },
        { id: 203, name: '双支礼盒', image: '/assets/logo.png' },
    ],
    3: [
        { id: 301, name: '所有干白', image: '/assets/logo.png' },
        { id: 302, name: '霞多丽', image: '/assets/logo.png' },
        { id: 303, name: '长相思', image: '/assets/logo.png' },
    ],
    4: [
        { id: 401, name: '贵腐', image: '/assets/logo.png' },
        { id: 402, name: '晚收甜白', image: '/assets/logo.png' },
    ],
    5: [
        { id: 501, name: '威士忌', image: '/assets/logo.png' },
        { id: 502, name: '白兰地', image: '/assets/logo.png' },
        { id: 503, name: 'XO', image: '/assets/logo.png' },
    ],
    6: [
        { id: 601, name: '无醇红', image: '/assets/logo.png' },
        { id: 602, name: '无醇起泡', image: '/assets/logo.png' },
    ],
    7: [
        { id: 701, name: '波尔多名庄', image: '/assets/logo.png' },
        { id: 702, name: '勃艮第名庄', image: '/assets/logo.png' },
    ],
    8: [
        { id: 801, name: '限时折扣', image: '/assets/logo.png' },
        { id: 802, name: '买赠专区', image: '/assets/logo.png' },
    ],
    9: [
        { id: 901, name: '香槟', image: '/assets/logo.png' },
        { id: 902, name: '起泡酒', image: '/assets/logo.png' },
    ],
}

export const goodsList: ProductItem[] = [
    {
        id: 1,
        name: '法国蓝孔雀干红 欧蓉 Pavo Cristatus',
        subtitle: '法国波尔多干红',
        price: 85,
        image: '/assets/logo.png',
        tag: '精选',
        comment: 13,
    },
    {
        id: 2,
        name: '西斯廷干红 celestine',
        subtitle: '法国干红葡萄酒',
        price: 98,
        image: '/assets/logo.png',
        tag: '热卖',
        comment: 11,
    },
    {
        id: 3,
        name: '萨博公主干红葡萄酒',
        subtitle: '法国进口红酒',
        price: 98,
        image: '/assets/logo.png',
        tag: '新品',
        comment: 13,
    },
    {
        id: 4,
        name: '乔梦干红 clementine',
        subtitle: '法国餐酒',
        price: 110,
        image: '/assets/logo.png',
        tag: '推荐',
        comment: 9,
    },
]

export const goodsDetailMap: Record<number, ProductDetail> = {
    1: {
        id: 1,
        name: 'Château Bordeaux Rouge',
        subtitle: '法国波尔多干红',
        price: 199,
        region: '波尔多',
        type: '红葡萄酒',
        alcohol: '13.5%',
        image: '/assets/logo.png',
        tag: '精选',
        comment: 13,
        description:
            '来自法国波尔多经典产区，采用传统酿造工艺，单宁柔和，带有黑莓与橡木香气，非常适合搭配牛排与奶酪。',
    },
    2: {
        id: 2,
        name: 'Champagne Brut Réserve',
        subtitle: '香槟区起泡酒',
        price: 399,
        region: '香槟区',
        type: '起泡酒',
        alcohol: '12%',
        image: '/assets/logo.png',
        tag: '热门',
        comment: 11,
        description:
            '酒体轻盈细腻，气泡绵密，带有柑橘与烤面包香气，适合庆祝、聚会与海鲜搭配。',
    },
}