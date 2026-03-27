import colors from './colors.json'

/**
 * 项目语义化颜色常量。
 * 保持“从 colors.json 读取并导出”的结构，便于后续与 Tailwind 主题映射联动。
 */
export const COLORS = {
  /** 页面背景色：只用于整页背景，避免与局部浅底块混用。 */
  background: colors.background,
  /** 通用内容层背景：用于普通白底内容区域。 */
  surface: colors.surface,
  /** 卡片背景色：用于订单卡片、商品卡片、底部工具栏等独立容器。 */
  card: colors.card,
  /** 弱层级浅背景：用于筛选条、浅提示块等轻层级区域。 */
  'surface-muted': colors['surface-muted'],
  /** 柔和浅背景：用于图片占位、输入区、空白预览块。 */
  'surface-soft': colors['surface-soft'],
  /** 偏暖浅背景：用于订单摘要、品牌说明块、温和强调区。 */
  'surface-warm': colors['surface-warm'],
  /** 警示弱底色：用于游客提示、温和提醒等非危险提示块。 */
  'warning-soft': colors['warning-soft'],
  /** 危险弱底色：用于库存不足、删除提示等危险信息的浅底承载。 */
  'danger-soft': colors['danger-soft'],

  /** 常规边框色：用于卡片、输入框、占位块等常规边框。 */
  border: colors.border,
  /** 分割线颜色：用于列表分隔、卡片内细线、工具栏顶部边界。 */
  divider: colors.divider,
  /** 危险操作边框色：用于删除、退款、关闭等危险按钮边框。 */
  'danger-border': colors['danger-border'],

  /** 主文字颜色：用于标题、正文、主要金额等核心文本。 */
  'text-main': colors['text-main'],
  /** 次级文字颜色：用于说明文案、副标题、辅助信息。 */
  'text-secondary': colors['text-secondary'],
  /** 弱提示文字颜色：用于时间、空状态补充文案、说明提示。 */
  'text-muted': colors['text-muted'],
  /** 禁用态文字颜色：用于未选中星级、禁用占位、弱可见状态。 */
  'text-disabled': colors['text-disabled'],
  /** 反白文字颜色：用于深色按钮、深色品牌块上的文本。 */
  'text-inverse': colors['text-inverse'],

  /** 品牌主色：用于品牌头图、会员卡、品牌级深色区块。 */
  primary: colors.primary,
  /** 品牌浅底色：用于商品图占位、匿名标签底色、品牌辅助区。 */
  'primary-soft': colors['primary-soft'],
  /** 兼容旧写法的强调色：新代码优先细分到更明确的业务语义色。 */
  accent: colors.accent,
  /** 头图/状态头部强调色：用于首页品牌区、订单状态头部等大面积品牌区块。 */
  hero: colors.hero,
  /** 主 CTA 色：用于提交、登录、下单、立即购买等主要行动按钮。 */
  cta: colors.cta,
  /** 链接与激活态颜色：用于页签激活、筛选激活、文字链接与可点击次动作。 */
  link: colors.link,
  /** 价格颜色：用于商品价格、订单金额、支付金额等价格信息。 */
  price: colors.price,
  /** 品牌标签色：用于商品角标、默认标签、小型品牌标识。 */
  'tag-brand': colors['tag-brand'],
  /** 入口标签文字色：用于首页分类、个人中心入口、菜单标签等入口型文案。 */
  'entry-label': colors['entry-label'],
  /** 会员徽章底色：用于会员身份、小型会员标识底色。 */
  'member-badge': colors['member-badge'],
  /** 会员徽章文字色：用于会员身份标识上的浅色文字。 */
  'member-badge-text': colors['member-badge-text'],
  /** 评分颜色：用于星级评分、评论打分等评价场景。 */
  rating: colors.rating,
  /** 空状态插画色：用于空列表、占位插画、弱情绪图标区。 */
  'empty-illustration': colors['empty-illustration'],

  /** 成功态颜色：用于完成状态、成功反馈、绿色进度节点。 */
  success: colors.success,
  /** 提醒态颜色：用于一般提醒、入口按钮、温和强调。 */
  warning: colors.warning,
  /** 危险态颜色：用于错误、删除、严重风险提示。 */
  danger: colors.danger,

  /** 遮罩层颜色：用于弹层蒙层、抽屉遮罩。 */
  'overlay-mask': colors['overlay-mask'],
  /** 浅色覆盖层背景：用于深色头图上的浮层提示块。 */
  'overlay-light': colors['overlay-light'],
  /** 浅色覆盖层边框：用于透明提示块的细边框。 */
  'overlay-border': colors['overlay-border'],
  /** 更强的浅色覆盖边框：用于状态头图中更明显的边框轮廓。 */
  'overlay-strong': colors['overlay-strong'],

  /** 待处理状态色：主要用于待支付、待处理等高关注状态。 */
  'status-pending': colors['status-pending'],
  /** 已支付状态色：主要用于支付成功、已付款相关状态。 */
  'status-paid': colors['status-paid'],
  /** 发货/物流状态色：用于发货中、物流中、再次购买等中间流转动作。 */
  'status-shipping': colors['status-shipping'],
  /** 完成状态色：用于已完成、已签收、成功结束的状态。 */
  'status-completed': colors['status-completed'],
  /** 关闭状态色：用于已关闭、已取消、失效等结束态。 */
  'status-cancelled': colors['status-cancelled'],
  /** 退款/售后中状态色：用于退款中、售后处理中等危险中间态。 */
  'status-refunding': colors['status-refunding'],

  /** 调试信息色：预留给后续调试工具中的普通信息提示。 */
  'debug-info': colors['debug-info'],
  /** 调试警告色：预留给后续调试工具中的提醒操作。 */
  'debug-warning': colors['debug-warning'],
  /** 调试危险色：预留给后续调试工具中的高风险操作提示。 */
  'debug-danger': colors['debug-danger'],

  /** 兼容旧写法：避免 TS 侧旧常量引用被一次性打断。 */
  // PRIMARY: colors.primary,
  // SECONDARY: colors['primary-soft'],
  // BACKGROUND: colors.background,
  // TEXT_MAIN: colors['text-main'],
  // TEXT_SECONDARY: colors['text-secondary'],
  // ACCENT: colors.accent,
  // BORDER: colors.border,
  // WHITE: colors.surface,
} as const

export type ColorToken = keyof typeof COLORS

export default COLORS
