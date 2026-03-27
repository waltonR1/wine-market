import {
  ALLOW_ACTIVATE_ORDER_DEBUG,
  ALLOW_ACTIVATE_RISKY_ORDER_DEBUG,
  ALLOW_EXPOSE_DEV_ENTRY,
  ALLOW_REQUEST_LOG,
  ALLOW_SHOW_DEBUG_BADGE,
  ALLOW_USE_LOCAL_MOCK_ASSIST,
  ALLOW_VISIT_LOCAL_DEBUG_PAGE,
  CURRENT_RUNTIME_ENV,
  IS_MOCK,
} from './env'

/**
 * 当前订单状态体系下的允许流转图。
 * 这是业务策略，不属于环境事实，因此放在 app.ts。
 * 后续订单调试系统、状态机信息、调试动作生成都会复用它。
 */
const ORDER_ALLOWED_TRANSITIONS = {
  1: [2, 6],
  2: [3, 6],
  3: [4, 6],
  4: [6],
  6: [],
} as const

/**
 * 应用业务配置与功能开关。
 * app.ts 负责业务含义、功能开关、产品策略层配置。
 */
export const APP_CONFIG = {
  /**
   * 兼容当前项目里仍使用平铺字段的旧代码。
   * 这样可以先整理配置结构，而不需要本阶段大范围修改业务文件。
   */
  // APP_NAME: 'Wine Market',
  // DEFAULT_PAGE_SIZE: 10,
  // ENABLE_LOG: ALLOW_REQUEST_LOG,
  // SERVICE_PHONE: '400-123-4567',
  // IMAGE_PLACEHOLDER: 'https://placehold.co/400x400/4A0D12/FFFFFF.png?text=Wine',
  // USE_SERVER_CART_SYNC: true,
  // ALLOW_ADD_OUT_OF_STOCK: false,

  /**
   * 应用基础信息。
   * 业务含义：应用名称、标题、版本、客服电话等基础产品信息。
   * 影响范围：公共文案、导航标题、未来调试说明。
   * 默认建议：长期保留。
   * 真实后端接入后：不建议关闭。
   */
  APP_INFO: {
    APP_NAME: 'Wine Market',
    APP_TITLE: 'Wine Market 精品酒馆',
    VERSION: '1.0.0',
    SERVICE_PHONE: '400-123-4567',
  },

  /**
   * 通用基础配置。
   * 业务含义：分页、图片占位、请求日志、购物车同步策略等。
   * 影响范围：request、购物车、公共展示逻辑。
   * 默认建议：除日志外大多建议长期保留。
   * 真实后端接入后：ENABLE_REQUEST_LOG 建议按环境关闭，其余通常保留。
   */
  COMMON: {
    DEFAULT_PAGE_SIZE: 10,
    IMAGE_PLACEHOLDER: 'https://placehold.co/400x400/4A0D12/FFFFFF.png?text=Wine',
    ENABLE_REQUEST_LOG: ALLOW_REQUEST_LOG,
    USE_SERVER_CART_SYNC: true,
    ALLOW_ADD_OUT_OF_STOCK: false,
  },

  /**
   * 订单调试相关业务开关。
   * 业务含义：未来订单调试系统的入口、能力、写回权限控制。
   * 影响范围：未来订单详情调试入口、调试页、调试接口、mock 写回能力。
   * 默认建议：普通调试能力仅在 mock 阶段开启，高风险能力默认关闭。
   * 真实后端接入后：除内部调试用途外，大部分建议关闭。
   */
  ORDER_FEATURES: {
    ENABLE_ORDER_DEBUG_TOOLKIT: ALLOW_ACTIVATE_ORDER_DEBUG,
    SHOW_ORDER_DEBUG_ENTRY: ALLOW_EXPOSE_DEV_ENTRY && ALLOW_ACTIVATE_ORDER_DEBUG,
    ALLOW_OPEN_ORDER_DEBUG_PAGE_FROM_DETAIL:
      ALLOW_VISIT_LOCAL_DEBUG_PAGE && ALLOW_ACTIVATE_ORDER_DEBUG,
    ALLOW_EDIT_ORDER_STATUS: ALLOW_ACTIVATE_ORDER_DEBUG,
    ALLOW_EDIT_ORDER_TIMELINE: ALLOW_USE_LOCAL_MOCK_ASSIST,
    ALLOW_SIMULATE_PAYMENT: ALLOW_ACTIVATE_ORDER_DEBUG,
    ALLOW_SIMULATE_DELIVERY: ALLOW_ACTIVATE_ORDER_DEBUG,
    ALLOW_SIMULATE_LOGISTICS_UPDATE: ALLOW_USE_LOCAL_MOCK_ASSIST,
    ALLOW_SIMULATE_RECEIVE: ALLOW_ACTIVATE_ORDER_DEBUG,
    ALLOW_SIMULATE_COMPLETE: ALLOW_ACTIVATE_ORDER_DEBUG,
    ALLOW_SIMULATE_CANCEL: ALLOW_ACTIVATE_ORDER_DEBUG,
    ALLOW_SIMULATE_AFTER_SALE: ALLOW_ACTIVATE_ORDER_DEBUG,
    ALLOW_DELETE_DEBUG_ORDER: false,
    ALLOW_RESET_ORDER_TO_INITIAL: ALLOW_USE_LOCAL_MOCK_ASSIST,
    ALLOW_DIRECT_STATUS_JUMP: false,
    ALLOW_VIEW_DEBUG_LOGS: ALLOW_ACTIVATE_ORDER_DEBUG,
    ALLOW_GENERATE_TEST_ORDER_SNAPSHOT: ALLOW_USE_LOCAL_MOCK_ASSIST,
    ALLOW_OVERRIDE_ORDER_ACTION_VISIBILITY: false,
    ALLOW_WRITE_LOCAL_MOCK_SOURCE: IS_MOCK && ALLOW_USE_LOCAL_MOCK_ASSIST,
    allowedTransitions: ORDER_ALLOWED_TRANSITIONS,
  },

  /**
   * 订单调试预设场景配置。
   * 业务含义：未来一键切换订单调试场景时使用的预设列表。
   * 影响范围：未来订单调试系统的快捷场景切换。
   * 默认建议：结构先保留，但仅在调试系统启用时生效。
   * 真实后端接入后：通常建议关闭。
   */
  ORDER_DEBUG_PRESETS: {
    ENABLE_PRESETS: ALLOW_ACTIVATE_ORDER_DEBUG,
    PRESET_LIST: [
      { key: 'pendingPay', title: '待付款' },
      { key: 'paidPendingShip', title: '已付款待发货' },
      { key: 'shippedPendingReceive', title: '已发货待收货' },
      { key: 'completedPendingComment', title: '待评价' },
      { key: 'closedCancelled', title: '已关闭' },
      { key: 'refundProcessing', title: '退款中' },
      { key: 'refundCompleted', title: '退款完成' },
      { key: 'afterSaleProcessing', title: '售后处理中' },
      { key: 'afterSaleCompleted', title: '售后完成' },
    ],
  },

  /**
   * 订单时间线规则。
   * 业务含义：未来调试时间线自动补齐、联动更新、顺序约束的规则来源。
   * 影响范围：未来订单调试系统的时间线编辑与校验逻辑。
   * 默认建议：顺序约束开启，忽略顺序约束关闭。
   * 真实后端接入后：手动覆盖与忽略顺序通常建议关闭。
   */
  ORDER_TIMELINE_RULES: {
    AUTO_FILL_TIMELINE_BY_STATUS: true,
    LINK_TIMELINE_WITH_STATUS: true,
    ENFORCE_ORDERED_TIMELINE: true,
    ALLOW_MANUAL_OVERRIDE_TIMELINE: ALLOW_USE_LOCAL_MOCK_ASSIST,
    ALLOW_IGNORE_TIMELINE_ORDER: false,
  },

  /**
   * 订单调试 UI 显示策略。
   * 业务含义：未来调试页里哪些区块可以显示。
   * 影响范围：未来调试标签、危险区、高级区、状态机、原始数据展示。
   * 默认建议：普通调试信息可按环境开放，高风险区默认只保留开关不放能力。
   * 真实后端接入后：整体建议关闭或仅内部保留。
   */
  ORDER_DEBUG_UI: {
    SHOW_DEBUG_BADGE: ALLOW_SHOW_DEBUG_BADGE,
    SHOW_DANGER_ZONE: ALLOW_ACTIVATE_RISKY_ORDER_DEBUG,
    SHOW_ADVANCED_ZONE: ALLOW_ACTIVATE_ORDER_DEBUG,
    SHOW_RAW_ORDER_JSON: ALLOW_ACTIVATE_ORDER_DEBUG,
    SHOW_STATE_MACHINE: ALLOW_ACTIVATE_ORDER_DEBUG,
    SHOW_AVAILABLE_ACTIONS: ALLOW_ACTIVATE_ORDER_DEBUG,
  },

  /**
   * 调试信息展示配置。
   * 业务含义：未来开发说明、环境提示、调试标签文本。
   * 影响范围：未来调试入口和调试页的说明展示。
   * 默认建议：仅开发调试阶段使用。
   * 真实后端接入后：建议关闭。
   */
  DEBUG_INFO: {
    RUNTIME_ENV: CURRENT_RUNTIME_ENV,
    LABEL: '开发调试',
  },

  /**
   * 主题最小必要结构。
   * 业务含义：预留后续与调试系统或主题体系联动的基础结构。
   * 影响范围：当前阶段不直接影响 UI，只保留最小必要信息。
   * 默认建议：最小保留即可。
   * 真实后端接入后：通常无需关闭。
   */
  THEME: {
    BRAND_NAME: 'wine',
  },
} as const

/**
 * 是否允许显示订单调试入口。
 * 这是业务层组合判断，后续页面层应直接复用，不要重复拼接多个开关。
 */
export function canShowOrderDebugEntry() {
  return (
    APP_CONFIG.ORDER_FEATURES.ENABLE_ORDER_DEBUG_TOOLKIT &&
    APP_CONFIG.ORDER_FEATURES.SHOW_ORDER_DEBUG_ENTRY &&
    APP_CONFIG.ORDER_FEATURES.ALLOW_OPEN_ORDER_DEBUG_PAGE_FROM_DETAIL
  )
}

/**
 * 是否允许访问订单调试页。
 * 这是业务层组合判断，后续调试页路由守卫应复用它。
 */
export function canAccessOrderDebugPage() {
  return (
    APP_CONFIG.ORDER_FEATURES.ENABLE_ORDER_DEBUG_TOOLKIT &&
    APP_CONFIG.ORDER_FEATURES.ALLOW_OPEN_ORDER_DEBUG_PAGE_FROM_DETAIL
  )
}

/**
 * 是否允许启用高风险订单调试能力。
 * 这是业务层组合判断，后续高风险操作区应统一复用它。
 */
export function canUseRiskyOrderDebugFeatures() {
  return (
    APP_CONFIG.ORDER_FEATURES.ENABLE_ORDER_DEBUG_TOOLKIT &&
    (APP_CONFIG.ORDER_FEATURES.ALLOW_DIRECT_STATUS_JUMP ||
      APP_CONFIG.ORDER_FEATURES.ALLOW_DELETE_DEBUG_ORDER ||
      APP_CONFIG.ORDER_FEATURES.ALLOW_OVERRIDE_ORDER_ACTION_VISIBILITY)
  )
}

export default APP_CONFIG
