/**
 * 运行环境类型。
 * 这是环境层事实，用来说明当前项目到底运行在哪一套环境中。
 * 它会影响请求地址、mock 能力、调试能力总开关等基础模块。
 */
export type RuntimeEnv = 'mock' | 'test' | 'prod'

function getRuntimeEnv(): RuntimeEnv {
  return 'mock'
}

/**
 * 获取当前运行环境。
 * 这是本阶段唯一的环境切换入口，打开文件即可一眼看出当前项目正在跑哪套配置。
 * 之所以放在 env.ts，是因为它属于环境事实，而不是业务策略。
 */
export const CURRENT_RUNTIME_ENV = getRuntimeEnv()

/**
 * 单个环境下允许的底层能力。
 * 这里只描述“当前环境客观允许什么”，不描述业务层是否真的要开启。
 */
interface EnvCapabilities {
  allowExposeDevEntry: boolean
  allowVisitLocalDebugPage: boolean
  allowActivateOrderDebug: boolean
  allowActivateRiskyOrderDebug: boolean
  allowShowDebugBadge: boolean
  allowUseLocalMockAssist: boolean
  allowRequestLog: boolean
}

/**
 * 单个环境的完整底层配置。
 * 它属于 env.ts，因为这些配置依赖运行环境本身，会影响请求层和基础能力判断。
 */
interface RuntimeEnvConfig {
  name: RuntimeEnv
  baseUrl: string
  apiPrefix: string
  requestTimeout: number
  useMockServer: boolean
  capabilities: EnvCapabilities
}

/**
 * 所有环境配置总表。
 * 当前项目通过手动切换 CURRENT_RUNTIME_ENV 来选择其中一套配置。
 */
const ENV_CONFIG_MAP: Record<RuntimeEnv, RuntimeEnvConfig> = {
  mock: {
    name: 'mock',
    baseUrl: 'http://127.0.0.1:3000',
    apiPrefix: '',
    requestTimeout: 10000,
    useMockServer: true,
    capabilities: {
      allowExposeDevEntry: true,
      allowVisitLocalDebugPage: true,
      allowActivateOrderDebug: true,
      allowActivateRiskyOrderDebug: true,
      allowShowDebugBadge: true,
      allowUseLocalMockAssist: true,
      allowRequestLog: true,
    },
  },
  test: {
    name: 'test',
    baseUrl: 'https://test-api.wine-market.com',
    apiPrefix: '/api/v1',
    requestTimeout: 10000,
    useMockServer: false,
    capabilities: {
      allowExposeDevEntry: false,
      allowVisitLocalDebugPage: false,
      allowActivateOrderDebug: false,
      allowActivateRiskyOrderDebug: false,
      allowShowDebugBadge: false,
      allowUseLocalMockAssist: false,
      allowRequestLog: true,
    },
  },
  prod: {
    name: 'prod',
    baseUrl: 'https://api.wine-market.com',
    apiPrefix: '/api/v1',
    requestTimeout: 10000,
    useMockServer: false,
    capabilities: {
      allowExposeDevEntry: false,
      allowVisitLocalDebugPage: false,
      allowActivateOrderDebug: false,
      allowActivateRiskyOrderDebug: false,
      allowShowDebugBadge: false,
      allowUseLocalMockAssist: false,
      allowRequestLog: false,
    },
  },
}

/**
 * 当前环境的完整底层配置。
 * 会影响 request、API 路径选择、mock 辅助判断、调试能力基础守卫等模块。
 */
export const CURRENT_ENV_CONFIG = ENV_CONFIG_MAP[CURRENT_RUNTIME_ENV]

/**
 * 当前是否 mock 环境。
 * 属于环境层事实，会影响 API 路径选择、mock 辅助能力和本地联调行为。
 */
export const IS_MOCK = CURRENT_ENV_CONFIG.useMockServer

/**
 * 当前是否 test 环境。
 * 属于环境层事实，主要用于和 mock、prod 做清晰区分。
 */
export const IS_TEST_ENV = CURRENT_RUNTIME_ENV === 'test'

/**
 * 当前是否 prod 环境。
 * 属于环境层事实，会影响开发入口和调试能力是否允许暴露。
 */
export const IS_PROD_ENV = CURRENT_RUNTIME_ENV === 'prod'

/**
 * 当前是否本地 mock 开发环境。
 * 当前项目没有单独的 dev 配置文件，因此用 mock 作为本地开发联调环境。
 */
export const IS_DEV_MOCK_ENV = CURRENT_RUNTIME_ENV === 'mock'

/**
 * 当前请求基础地址。
 * 属于底层网络配置，会影响所有 request 调用。
 */
export const BASE_URL = CURRENT_ENV_CONFIG.baseUrl

/**
 * 当前 API 前缀。
 * 属于底层网络配置，用于兼容 mock 和真实后端路径差异。
 */
export const API_PREFIX = CURRENT_ENV_CONFIG.apiPrefix

/**
 * 当前请求超时时间。
 * 属于底层网络配置，会统一影响 request 层。
 */
export const REQUEST_TIMEOUT = CURRENT_ENV_CONFIG.requestTimeout

/**
 * 是否允许暴露开发入口。
 * 这是环境层能力，不代表业务上一定展示，只表示环境本身允许显示。
 */
export const ALLOW_EXPOSE_DEV_ENTRY = CURRENT_ENV_CONFIG.capabilities.allowExposeDevEntry

/**
 * 是否允许访问本地调试页。
 * 这是环境层能力，后续订单调试页应该先经过这层守卫。
 */
export const ALLOW_VISIT_LOCAL_DEBUG_PAGE =
  CURRENT_ENV_CONFIG.capabilities.allowVisitLocalDebugPage

/**
 * 是否允许激活订单调试能力。
 * 这是订单调试系统的环境层总开关，后续调试入口和调试接口都应受它约束。
 */
export const ALLOW_ACTIVATE_ORDER_DEBUG =
  CURRENT_ENV_CONFIG.capabilities.allowActivateOrderDebug

/**
 * 是否允许激活高风险调试能力。
 * 例如直接跳状态、忽略时间线顺序、删除调试订单等能力，都应先经过它控制。
 */
export const ALLOW_ACTIVATE_RISKY_ORDER_DEBUG =
  CURRENT_ENV_CONFIG.capabilities.allowActivateRiskyOrderDebug

/**
 * 是否允许显示调试标识。
 * 这是环境层能力，未来会影响调试标签和开发提示的展示。
 */
export const ALLOW_SHOW_DEBUG_BADGE = CURRENT_ENV_CONFIG.capabilities.allowShowDebugBadge

/**
 * 是否允许使用本地 mock 辅助能力。
 * 这是环境层能力，未来会影响是否允许补齐未完成后端能力、是否允许本地 mock 写回。
 */
export const ALLOW_USE_LOCAL_MOCK_ASSIST =
  CURRENT_ENV_CONFIG.capabilities.allowUseLocalMockAssist

/**
 * 是否允许打印请求日志。
 * 这是环境层能力，会直接影响 request 层日志输出。
 */
export const ALLOW_REQUEST_LOG = CURRENT_ENV_CONFIG.capabilities.allowRequestLog

export default CURRENT_ENV_CONFIG
