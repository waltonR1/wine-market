import {IS_MOCK} from './env'

/**
 * 路径处理助手
 * @param mockPath Mock 环境下的路径 (对应 db.json)
 * @param realPath 真实环境下的路径 (默认与 mockPath 相同)
 */
function p<T extends string | ((...args: any[]) => string)>(mockPath: T, realPath?: T): T {
  return (IS_MOCK ? mockPath : (realPath || mockPath)) as T
}

/**
 * API 路径配置文件
 *
 * 这里的路径在 Mock 模式下对应 db.json 中的键名，
 * 在真实模式下对应标准的 RESTful API 路径。
 *
 * 通过 IS_MOCK 开关一键切换。
 */
export const API_PATHS = {
  // 会员相关
  MEMBER_PROFILE: p('/member_profile', '/member/profile'),
  MEMBER_WALLET: p('/member_wallet', '/member/wallet'),

  // 商品相关
  HOME_CATEGORIES: p('/home_categories', '/home/categories'),
  HOME_PRODUCTS: p('/home_products', '/home/products'),
  CATEGORIES_FIRST: p('/categories_first', '/categories/first'),
  CATEGORIES_SECOND: p('/categories_second', '/categories/second'),
  GOODS_LIST: p('/goods', '/goods'),
  GOODS_DETAIL: p((id: number | string) => `/goods/${id}`, (id: number | string) => `/goods/${id}`),

  // 订单相关
  ORDER_CONFIRM_LIST: p('/order_confirm_list', '/orders/confirm'),
  ORDER_LIST: p('/orders', '/orders'),

  // 地址管理
  ADDRESS_LIST: p('/addresses', '/addresses'),
  ADDRESS_DEFAULT: p('/addresses/default', '/addresses/default'),
  ADDRESS_ITEM: p(
    (id: number | string) => `/addresses/${id}`,
    (id: number | string) => `/addresses/${id}`
  ),
  ADDRESS_SET_DEFAULT: p(
    (id: number | string) => `/addresses/${id}/default`,
    (id: number | string) => `/addresses/${id}/default`
  ),

  // 用户相关
  USER_LOGIN: p('/user_login', '/auth/login'),
  USER_INFO: p('/user_info', '/user/info'),

  // 购物车
  CART_LIST: p('/cart', '/cart'),
  CART_ADD: p('/cart', '/cart'),
  CART_ITEM: p(
    (id: number | string) => `/cart/${id}`,
    (id: number | string) => `/cart/${id}`
  ),
  CART_CLEAR: p('/cart', '/cart'),

  // 会员扩展
  MEMBER_COUPONS: p('/coupons', '/coupons'),
  MEMBER_POINTS_HISTORY: p('/point-records', '/point-records'),
  MEMBER_FAVORITES: p('/favorites', '/favorites'),
  MEMBER_FOOTPRINTS: p('/footprints', '/footprints'),
  MEMBER_REALNAME: p('/realname', '/realname'),
  MEMBER_INVOICES: p('/invoices', '/invoices'),
} as const
