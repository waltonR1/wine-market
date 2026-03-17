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
  GOODS_LIST: p('/goods', '/goods/list'),
  GOODS_DETAIL: p(
    (id: number | string) => `/goods_${id}`,
    (id: number | string) => `/goods/${id}`
  ),

  // 订单相关
  ORDER_DEFAULT_ADDRESS: p('/order_default_address', '/order/address/default'),
  ORDER_ADDRESS_LIST: p('/order_address_list', '/order/address/list'),
  ORDER_CONFIRM_LIST: p('/order_confirm_list', '/order/confirm'),
  ORDER_LIST: p('/order_list', '/order/list'),

  // 用户相关
  USER_LOGIN: p('/user_login', '/auth/login'),
  USER_INFO: p('/user_info', '/user/info'),

  // 购物车
  CART_LIST: p('/cart_list', '/cart/list'),
  CART_ADD: p('/cart_add', '/cart/add'),
  CART_UPDATE_COUNT: p('/cart_update_count', '/cart/update/count'),
  CART_UPDATE_CHECKED: p('/cart_update_checked', '/cart/update/checked'),
  CART_UPDATE_ALL_CHECKED: p('/cart_update_all_checked', '/cart/update/all-checked'),
  CART_DELETE: p('/cart_delete', '/cart/delete'),
  CART_BATCH_DELETE: p('/cart_batch_delete', '/cart/batch-delete'),
  CART_CLEAR: p('/cart_clear', '/cart/clear'),
  CART_SUMMARY: p('/cart_summary', '/cart/summary'),

  // 会员扩展
  MEMBER_COUPONS: p('/member_coupons', '/member/coupons'),
  MEMBER_POINTS_HISTORY: p('/member_points_history', '/member/points/history'),
  MEMBER_FAVORITES: p('/member_favorites', '/member/favorites'),
  MEMBER_FOOTPRINTS: p('/member_footprints', '/member/footprints'),
  MEMBER_REALNAME: p('/member_realname', '/member/realname'),
  MEMBER_INVOICES: p('/member_invoices', '/member/invoices'),
} as const
