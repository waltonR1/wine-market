# 订单领域与状态流转说明

更新时间：2026-03-28

## 1. 文档目的
本文件用于沉淀当前项目中“订单域”的核心规则，避免状态、按钮、时间字段、售后字段、评论字段在不同页面各写一套。

主要说明：
- 当前订单状态码
- 状态文案与规则位置
- 状态流转
- 按钮动作来源
- 时间字段含义
- 物流字段结构
- 售后字段结构
- 评论字段结构

## 2. 核心代码位置
订单域规则当前主要收口在以下文件：
- `src/utils/order.ts`
- `src/hooks/useOrder.ts`
- `src/types/model/order.ts`
- `src/types/api/order.ts`
- `src/api/modules/order.ts`
- `src/pages/order/list.vue`
- `src/pages/order/detail.vue`
- `server.js`

## 3. 当前订单状态码
当前项目中使用的订单状态码：

- `1`：待付款
- `2`：待发货
- `3`：待收货
- `4`：待评价
- `6`：已关闭

当前“已关闭”包含两类关闭来源：
- 取消关闭
- 评论后关闭

通过字段区分：
- `closeReason = 'cancelled'`
- `closeReason = 'commented'`

## 4. 状态文案与规则来源

### 4.1 状态文案
来源文件：
- `src/utils/order.ts`

当前通过统一配置生成：
- `ORDER_STATUS_CONFIG`
- `getOrderStatusText()`
- `getOrderStatusDesc()`
- `getOrderStatusDescByOrder()`
- `getOrderDisplayStatusLabel()`

### 4.2 按钮动作来源
来源文件：
- `src/utils/order.ts`

当前由以下结构统一决定：
- `ORDER_ACTION_META`
- `getOrderActions()`

列表卡片和详情底部按钮都应复用这套结果，不应在页面里散写大量状态判断。

## 5. 当前订单状态流转

### 5.1 正常业务流转
- 下单成功：`1 待付款`
- 支付成功：`1 -> 2`
- 发货完成：`2 -> 3`
- 确认收货：`3 -> 4`
- 提交评价：`4 -> 6`

### 5.2 关闭流转
- 用户取消：`1 -> 6`
- 超时关闭：通常也进入 `6`
- 系统关闭：通常也进入 `6`

### 5.3 售后不直接改主状态
当前售后状态主要通过这些字段表达：
- `afterSaleStatus`
- `afterSaleTimeline`

也就是说：
- 主订单状态仍保留原生命周期状态
- 售后是叠加状态，不单独重建主订单状态体系

## 6. allowedTransitions
订单调试工具当前兼容的主状态推进图：

- `1 -> [2, 6]`
- `2 -> [3, 6]`
- `3 -> [4, 6]`
- `4 -> [6]`
- `6 -> []`

这套图主要用于：
- 调试工具推进状态
- 状态机展示
- 限制非法直接推进

## 7. 按钮动作定义
当前项目常见订单动作：
- `cancel`
- `pay`
- `confirm`
- `comment`
- `delete`
- `rebuy`
- `aftersale`

动作显示规则由状态配置和条件函数共同决定：
- `canDeleteOrder()`
- `canApplyAfterSale()`
- `canCommentOrder()`
- `canAppendComment()`
- `canRebuyOrder()`

## 8. 时间字段说明
当前订单时间字段主要包括：

- `createTime`
  - 下单时间

- `payTime`
  - 支付成功时间

- `deliveryTime`
  - 商家发货时间

- `finishTime`
  - 收货完成 / 订单完成时间

- `cancelTime`
  - 订单关闭时间

- `commentTime`
  - 首次评价时间

- `appendCommentTime`
  - 追评时间

- `refundTime`
  - 退款完成时间

- `afterSaleApplyTime`
  - 售后申请时间

- `afterSaleHandleTime`
  - 平台处理时间

- `afterSaleCompleteTime`
  - 售后结束时间

原则：
- 这些字段都属于真实订单业务字段
- 调试工具、mock、正式业务页面都应直接使用这些字段

## 9. 支付字段说明
当前支付相关字段主要包括：
- `payType`
- `payTime`

当前项目仍是 mock 支付阶段，不接真实微信支付，但字段结构应保持可扩展。

## 10. 物流字段说明
当前物流字段主要包括：
- `logisticsCompany`
- `logisticsNo`
- `logisticsStatusText`
- `logisticsTracks`

其中：
- `logisticsTracks` 是物流轨迹数组
- 每项通常包含 `time/title/description`

原则：
- 详情页展示直接读取这些字段
- 调试工具更新物流时直接写回这些字段
- 后续真实物流系统接入时也继续沿用这套字段

## 11. 评论字段说明
当前评论字段主要包括：
- `commentScore`
- `commentContent`
- `commentAnonymous`
- `commentImages`
- `commentTime`

追评字段：
- `appendCommentContent`
- `appendCommentImages`
- `appendCommentTime`

当前现状：
- 仍以整单评论为主

后续明确要做的调整：
- 改为按订单中的每个商品分别评论

## 12. 售后字段说明
当前售后字段主要包括：
- `afterSaleStatus`
- `afterSaleType`
- `afterSaleReason`
- `afterSaleRejectReason`
- `afterSaleApplyTime`
- `afterSaleHandleTime`
- `afterSaleCompleteTime`
- `afterSaleTimeline`

当前常见售后状态：
- `none`
- `applying`
- `reviewing`
- `approved`
- `refunding`
- `completed`
- `rejected`

## 13. 页面与数据同步原则

### 13.1 页面层
页面层不直接做状态写回，只负责：
- 展示
- 交互触发
- 调用 hook

### 13.2 hooks 层
`src/hooks/useOrder.ts` 负责：
- 调用 API
- 统一本地同步 `orderList / orderDetail`
- 统一状态写回

### 13.3 utils 层
`src/utils/order.ts` 负责：
- 状态规则
- 文案规则
- 按钮规则
- 订单 normalize

### 13.4 mock / 后端层
mock 或后端负责：
- 真实字段返回
- 状态流转写回
- 时间字段补齐

## 14. 后续演进建议

### 14.1 评论系统
优先升级为：
- 按商品逐项评论
- 按商品逐项追评

### 14.2 订单状态
如果后续引入更完整状态体系，建议：
- 保持旧状态码兼容
- 不直接推翻 `utils/order.ts` 的集中规则方式

### 14.3 售后流程
后续可继续补：
- 独立售后详情页
- 平台处理备注
- 凭证上传
- 客服对话

## 15. 相关文件
- `src/utils/order.ts`
- `src/hooks/useOrder.ts`
- `src/types/model/order.ts`
- `src/types/api/order.ts`
- `src/api/modules/order.ts`
- `src/pages/order/list.vue`
- `src/pages/order/detail.vue`
- `src/pages/order/comment.vue`
- `src/pages/order/aftersale.vue`
- `server.js`
