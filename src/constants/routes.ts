// 晚些再调整

/**
 * 路由常量
 */
export const ROUTES = {
  // 首页
  HOME: '/pages/index/index',

  // 商品
  GOODS_LIST: '/pages/goods/list',
  GOODS_CATEGORY: '/pages/goods/category',
  GOODS_DETAIL: '/pages/goods/detail',

  // 购物车
  CART: '/pages/cart/index',

  // 订单
  ORDER_CONFIRM: '/pages/order/confirm',
  ORDER_LIST: '/pages/order/list',

  // 个人中心
  MEMBER: '/pages/member/index',
  MEMBER_WALLET: '/pages/member/wallet',
  MEMBER_COUPONS: '/pages/member/coupons',
  MEMBER_POINTS: '/pages/member/points',
  MEMBER_COLLECTION: '/pages/member/collection',
  MEMBER_PROMOTION: '/pages/member/promotion',
  MEMBER_SHARE: '/pages/member/share',
  MEMBER_FOOTPRINTS: '/pages/member/footprints',
  MEMBER_INFO: '/pages/member/info',
  MEMBER_ADDRESS: '/pages/member/address',
  MEMBER_SETTINGS: '/pages/member/settings',
  MEMBER_REALNAME: '/pages/member/realname',
  MEMBER_INVOICE: '/pages/member/invoice',

  // 登录
  LOGIN: '/pages/login/index',
} as const

export default ROUTES
