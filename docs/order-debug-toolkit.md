# 订单调试系统说明

更新时间：2026-03-28

## 1. 文档目的
本文件用于说明当前项目中的“订单调试系统（Order Debug Toolkit）”。

目标是让开发、联调、测试阶段明确知道：
- 调试系统是什么
- 调试系统能做什么
- 调试系统受哪些配置控制
- 调试系统会修改哪些真实订单字段
- 哪些能力属于高风险能力
- 什么时候应该关闭

## 2. 定位
订单调试系统不是正式业务功能，而是开发/测试辅助工具。

它的作用是：
- 在 mock / test 阶段快速推进订单生命周期
- 验证订单列表、详情、支付、物流、评价、售后等页面表现
- 在后端接口尚未全部完善前，补足前端联调手段

它不是：
- 给普通用户使用的页面
- 真实支付或真实物流系统的替代品
- 另一套独立于正式订单字段之外的影子状态系统

## 3. 入口与位置
当前入口位置：
- 订单详情页顶部状态区

对应页面：
- `src/pages/order/detail.vue`
- `src/pages/order/debug.vue`

设计原则：
- 入口低干扰
- 不影响普通用户底部按钮区
- 后续可通过配置完全关闭入口与访问

## 4. 双层控制规则
订单调试系统必须经过两层控制。

### 4.1 环境层控制
文件：
- `src/config/env.ts`

核心控制项：
- `ALLOW_EXPOSE_DEV_ENTRY`
- `ALLOW_VISIT_LOCAL_DEBUG_PAGE`
- `ALLOW_ACTIVATE_ORDER_DEBUG`
- `ALLOW_ACTIVATE_RISKY_ORDER_DEBUG`
- `ALLOW_USE_LOCAL_MOCK_ASSIST`

作用：
- 决定当前环境是否允许暴露调试入口
- 决定当前环境是否允许访问调试页
- 决定当前环境是否允许高风险调试能力

### 4.2 业务层控制
文件：
- `src/config/app.ts`

核心控制项：
- `ORDER_FEATURES`
- `ORDER_DEBUG_PRESETS`
- `ORDER_TIMELINE_RULES`
- `ORDER_DEBUG_UI`

作用：
- 决定业务上是否启用订单调试系统
- 决定展示哪些入口、哪些分区、哪些能力
- 决定 allowedTransitions、时间线规则、危险区是否显示

## 5. 当前支持的能力

### 5.1 生命周期调试
- 按 `allowedTransitions` 推进状态
- 预设场景切换
- 高风险直接跳状态
- 基于快照重置到初始状态

### 5.2 时间线调试
- 查看订单关键时间字段
- 编辑 `createTime`
- 编辑 `payTime`
- 编辑 `deliveryTime`
- 编辑 `finishTime`
- 编辑 `cancelTime`
- 编辑 `refundTime`
- 编辑 `afterSaleApplyTime`
- 编辑 `afterSaleHandleTime`
- 编辑 `afterSaleCompleteTime`

### 5.3 支付调试
- 模拟支付成功
- 模拟支付失败
- 模拟支付关闭

### 5.4 发货与物流调试
- 模拟发货
- 编辑物流公司
- 编辑物流单号
- 编辑物流状态
- 追加物流轨迹
- 模拟签收 / 收货

### 5.5 取消与关闭调试
- 模拟用户取消
- 模拟系统取消
- 模拟超时关闭

### 5.6 售后 / 退款调试
- 发起退款 / 售后
- 推进退款处理中
- 模拟退款成功
- 模拟退款失败
- 推进售后处理中
- 推进售后完成

### 5.7 信息查看
- 当前订单核心字段
- 当前状态码、状态文案
- 当前可执行用户动作
- 当前调试能力开关
- 状态机信息
- 原始 JSON 数据
- 当前页面会话日志

## 6. 数据模型原则
订单调试系统必须遵守以下原则：

### 6.1 直接写回真实业务字段
调试系统会直接修改现有订单字段，例如：
- `status`
- `createTime`
- `payTime`
- `deliveryTime`
- `finishTime`
- `cancelTime`
- `refundTime`
- `afterSaleApplyTime`
- `afterSaleHandleTime`
- `afterSaleCompleteTime`
- `logisticsCompany`
- `logisticsNo`
- `logisticsStatusText`
- `logisticsTracks`

### 6.2 不允许平行 debug 字段体系
不应引入：
- `debugStatus`
- `debugPayTime`
- `debugDeliveryTime`
- `debugLogistics`

页面也不应同时依赖“正式字段 + debug 字段”两套来源。

### 6.3 调试专属信息最小化
允许存在的调试专属信息：
- 页面级日志
- 页面级临时表单状态
- 快照元信息 `__debugMeta`

但这些字段不得参与正常业务判断。

## 7. 快照与重置规则
重置订单能力必须基于快照恢复。

当前实现方式：
- 首次进入调试时，为当前订单生成 `__debugMeta.initialSnapshot`
- 后续点击“重置”时，恢复到这份快照

不允许的方式：
- 维护 `debugOriginalStatus`
- 维护 `debugOriginalPayTime`
- 给每个字段都配一套 `debugOriginalXXX`

## 8. 高风险能力说明
以下能力属于高风险：
- 直接跳状态
- 忽略时间线顺序
- 删除调试订单
- 重置订单

风险点：
- 可能绕开正常状态机
- 可能制造测试数据异常
- 可能导致页面表现和正常业务不一致

要求：
- 必须与普通调试能力分开控制
- 必须在 UI 上独立分区
- 默认建议关闭

## 9. 对正式业务链路的要求
订单调试系统不应破坏以下正式链路：
- 下单
- 支付
- 取消订单
- 确认收货
- 评论
- 售后申请

正式业务接口保持原语义不变，调试能力应尽量走独立 API、独立 hook、独立 mock 适配层。

## 10. 后续接真实后端时的建议
真实后端接入后建议做以下处理：

### 10.1 默认关闭
- 调试入口
- 调试页访问
- 高风险调试能力
- 本地 mock 写回

### 10.2 可保留但受限
- test 环境下保留基础调试工具
- 仅内部账号或内部构建开放
- 明确日志和数据隔离策略

### 10.3 需要补文档
- 调试能力列表
- 哪些环境允许
- 哪些人员允许
- 哪些数据允许被修改

## 11. 相关文件
- `src/config/env.ts`
- `src/config/app.ts`
- `src/pages/order/detail.vue`
- `src/pages/order/debug.vue`
- `src/hooks/useOrder.ts`
- `src/hooks/useOrderDebug.ts`
- `src/utils/order.ts`
- `src/utils/orderDebug.ts`
- `src/types/model/order.ts`
- `src/types/model/order-debug.ts`
- `src/api/modules/order.ts`
- `server.js`
