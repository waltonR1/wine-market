import colors from './colors.json'

/**
 * 项目配色方案 (基于 colors.json)
 */
export const COLORS = {
  // 品牌色 - 深红
  PRIMARY: colors.primary,
  // 辅助色 - 浅金
  SECONDARY: colors.secondary,
  // 背景色 - 米色
  BACKGROUND: colors.background,
  // 文字色 - 深灰
  TEXT_MAIN: colors['text-main'],
  // 次要文字色 - 灰褐
  TEXT_SECONDARY: colors['text-secondary'],
  // 强调色 - 亮红
  ACCENT: colors.accent,
  // 边框/分割线
  BORDER: colors.border,
  // 白色
  WHITE: '#FFFFFF',
} as const

export default COLORS
