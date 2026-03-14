/**
 * 环境配置文件
 */

// 是否开启 Mock 模式 (true: 使用 json-server, false: 使用真实后端)
export const IS_MOCK = true

// 各环境的基础 URL
const MOCK_URL = 'http://127.0.0.1:3000'
const PROD_URL = 'https://api.wine-market.com' // 假设的正式环境 API

// 最终使用的 BASE_URL
export const BASE_URL = IS_MOCK ? MOCK_URL : PROD_URL

// 请求超时时间 (毫秒)
export const REQUEST_TIMEOUT = 10000

/**
 * 项目全局业务配置
 */
export const APP_CONFIG = {
    NAME: 'Wine Market 精品酒馆',
    VERSION: '1.0.0',
    // 是否在控制台打印请求日志 (建议在正式环境下关闭)
    ENABLE_LOG: true,
    // 默认分页大小
    DEFAULT_PAGE_SIZE: 10,
    // 客服电话
    SERVICE_PHONE: '400-123-4567',
    // 默认图片占位符 (当图片加载失败或为空时使用)
    DEFAULT_IMAGE: '/assets/logo.png',
} as const

/**
 * API 前缀配置 (如果真实环境需要 /api/v1 这种前缀，可以在这里统一处理)
 */
export const API_PREFIX = IS_MOCK ? '' : '/api/v1'
