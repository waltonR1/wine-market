/**
 * 应用配置
 */
export const APP_CONFIG = {
  // 应用名称
  APP_NAME: 'Wine Market',

  // 默认分页大小
  DEFAULT_PAGE_SIZE: 10,

  // 是否启用请求日志
  ENABLE_LOG: true,

  // 客服电话
  SERVICE_PHONE: '400-123-4567',

  // 图片懒加载占位图
  IMAGE_PLACEHOLDER: 'https://placehold.co/400x400/4A0D12/FFFFFF.png?text=Wine',

  /**
   * 购物车同步策略：
   * true  = 以后端返回数据为准
   * false = 以本地乐观更新结果为准
   */
  USE_SERVER_CART_SYNC: true,

  // 是否允许添加库存为0的商品至购物车
  ALLOW_ADD_OUT_OF_STOCK: false,
} as const

export default APP_CONFIG
