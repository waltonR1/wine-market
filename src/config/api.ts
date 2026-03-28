import { IS_MOCK } from './env'

type Id = string | number
type PathBuilder<Args extends readonly unknown[] = readonly unknown[]> = (...args: Args) => string
type ApiPathValue = string | PathBuilder

/**
 * 在 mock / real 环境之间选择路径。
 * 支持静态字符串和动态函数路径，类型由 TypeScript 自动推导。
 */
function pickPath<T extends string>(mockValue: T, realValue: T): T
function pickPath<Args extends readonly unknown[]>(
  mockValue: PathBuilder<Args>,
  realValue: PathBuilder<Args>
): PathBuilder<Args>
function pickPath(mockValue: ApiPathValue, realValue: ApiPathValue): ApiPathValue {
  return IS_MOCK ? mockValue : realValue
}

/**
 * API 路径配置（按模块分组）
 * 当前 mock 与 real 暂时一致的接口，也统一保留双路径占位，便于后续平滑切换。
 */
export const API_PATHS = {
  MEMBER: {
    PROFILE: pickPath('/member_profile', '/member/profile'),
    WALLET: pickPath('/member_wallet', '/member/wallet'),
    COUPONS: pickPath('/coupons', '/coupons'),
    POINTS_HISTORY: pickPath('/point-records', '/point-records'),
    FAVORITES: pickPath('/favorites', '/favorites'),
    FOOTPRINTS: pickPath('/footprints', '/footprints'),
    REALNAME: pickPath('/realname', '/realname'),
    INVOICES: pickPath('/invoices', '/invoices'),
  },

  HOME: {
    CATEGORIES: pickPath('/home_categories', '/home/categories'),
    PRODUCTS: pickPath('/home_products', '/home/products'),
  },

  CATEGORY: {
    FIRST: pickPath('/categories_first', '/categories/first'),
    SECOND: pickPath('/categories_second', '/categories/second'),
  },

  GOODS: {
    LIST: pickPath('/goods', '/goods'),
    DETAIL: pickPath(
      (id: Id) => `/goods/${id}`,
      (id: Id) => `/goods/${id}`
    ),
  },

  CART: {
    LIST: pickPath('/cart', '/cart'),
    ADD: pickPath('/cart', '/cart'),
    ITEM: pickPath(
      (id: Id) => `/cart/${id}`,
      (id: Id) => `/cart/${id}`
    ),
    CLEAR: pickPath('/cart', '/cart'),
  },

  ADDRESS: {
    LIST: pickPath('/addresses', '/addresses'),
    CREATE: pickPath('/addresses', '/addresses'),
    DEFAULT: pickPath('/addresses/default', '/addresses/default'),
    ITEM: pickPath(
      (id: Id) => `/addresses/${id}`,
      (id: Id) => `/addresses/${id}`
    ),
    SET_DEFAULT: pickPath(
      (id: Id) => `/addresses/${id}/default`,
      (id: Id) => `/addresses/${id}/default`
    ),
  },

  ORDER: {
    CONFIRM_LIST: pickPath('/order_confirm_list', '/orders/confirm'),
    LIST: pickPath('/orders', '/orders'),
    SUBMIT: pickPath('/orders/submit', '/orders/submit'),
    CANCEL: pickPath(
      (id: Id) => `/orders/${id}/cancel`,
      (id: Id) => `/orders/${id}/cancel`
    ),
    DELETE: pickPath(
      (id: Id) => `/orders/${id}`,
      (id: Id) => `/orders/${id}`
    ),
    CONFIRM: pickPath(
      (id: Id) => `/orders/${id}/confirm`,
      (id: Id) => `/orders/${id}/confirm`
    ),
    REBUY: pickPath(
      (id: Id) => `/orders/${id}/rebuy`,
      (id: Id) => `/orders/${id}/rebuy`
    ),
    COMMENT: pickPath(
      (id: Id) => `/orders/${id}/comment`,
      (id: Id) => `/orders/${id}/comment`
    ),
    AFTER_SALE: pickPath(
      (id: Id) => `/orders/${id}/after-sale`,
      (id: Id) => `/orders/${id}/after-sale`
    ),
    AFTER_SALE_ADVANCE: pickPath(
      (id: Id) => `/orders/${id}/after-sale/advance`,
      (id: Id) => `/orders/${id}/after-sale/advance`
    ),
    DEBUG_INFO: pickPath(
      (id: Id) => `/orders/${id}/debug`,
      (id: Id) => `/orders/${id}/debug`
    ),
    DEBUG_ACTION: pickPath(
      (id: Id) => `/orders/${id}/debug`,
      (id: Id) => `/orders/${id}/debug`
    ),
    // 保持现有接口契约：当前 mock 服务为 /order/:id/detail（单数）
    DETAIL: pickPath(
      (id: Id) => `/order/${id}/detail`,
      (id: Id) => `/order/${id}/detail`
    ),
    PAY: pickPath('/order/pay', '/order/pay'),
  },

  USER: {
    LOGIN: pickPath('/user_login', '/auth/login'),
    INFO: pickPath('/user_info', '/user/info'),
  },
} as const
