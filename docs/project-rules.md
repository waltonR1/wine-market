# Wine Market 项目规则

更新时间：2026-03-28

## 1. 目标
本文件用于说明当前项目的开发边界、目录职责和实现约束。

核心目标：
- 保持分层清晰
- 保持类型边界清晰
- 保持页面层简单
- 保持后续可联调、可扩展、可维护

## 2. 总体分层原则
当前项目默认遵守以下数据流：

```txt
pages -> hooks -> api/modules -> request -> mock / real backend
             |
           store
```

含义：
- `pages` 负责展示与交互
- `hooks` 负责业务逻辑与状态协调
- `api/modules` 负责接口请求
- `store` 负责跨页面共享状态
- `utils` 负责规则与纯函数

## 3. 强约束
以下约束必须持续遵守：

### 3.1 页面层约束
- 页面层不直接调用 `api/modules`
- 页面层不直接依赖 `API_PATHS`
- 页面只通过 hooks 调业务
- 页面层只做展示、交互、页面生命周期处理

### 3.2 API 层约束
- API 请求只放在 `src/api/modules/*`
- `src/api/index.ts` 只做统一导出
- API 模块不写页面逻辑

### 3.3 订单域约束
- 订单状态规则统一放在 `src/utils/order.ts`
- 订单状态同步统一收口在 `src/hooks/useOrder.ts`
- 订单页面不要各自散写一套状态判断

### 3.4 类型分层约束
- `src/types/model/*` 只放业务模型
- `src/types/api/*` 只放接口请求 / 响应契约
- 不要把接口包装类型塞回 model 层
- 不要把纯业务模型塞到 api 层

### 3.5 改动原则
- 优先最小必要改动
- 不为重构而重构
- 先兼容现有结构，再考虑扩展

## 4. 目录职责

### 4.1 `src/pages/`
职责：
- 页面结构
- 页面事件
- 页面跳转
- 页面级 loading / empty / error 展示

不要放：
- 大量复用业务逻辑
- 直接 request
- 直接 API_PATHS

### 4.2 `src/hooks/`
职责：
- 可复用业务逻辑
- 页面状态协调
- API 调用收口
- store 协调

命名：
- 统一使用 `useXxx.ts`

### 4.3 `src/api/modules/`
职责：
- 按业务模块封装接口
- 返回统一 `request<T>()`

不要放：
- 页面跳转
- toast / modal 交互
- 复杂页面状态同步

### 4.4 `src/store/`
职责：
- 跨页面共享状态
- 跨页面临时业务数据

不要放：
- 只在单页使用的局部状态
- 复杂 API 调用逻辑

### 4.5 `src/utils/`
职责：
- 纯函数
- 规则收口
- 格式化
- 校验

当前关键规则文件：
- `src/utils/order.ts`
- `src/utils/orderDebug.ts`
- `src/utils/request.ts`
- `src/utils/format.ts`

### 4.6 `src/types/model/`
职责：
- 业务实体
- 业务状态
- 业务字段结构

例如：
- `OrderItem`
- `OrderDetail`
- `AddressInfo`
- `GoodsItem`

### 4.7 `src/types/api/`
职责：
- 请求参数契约
- 响应结果契约
- API 层包装类型

例如：
- `CreateOrderRequest`
- `GetOrderDetailResponse`
- `OrderDebugActionResponse`

### 4.8 `src/config/`
职责：
- 显式环境配置
- 应用业务配置
- API 路径配置

当前关键文件：
- `env.ts`
- `app.ts`
- `api.ts`

### 4.9 `src/components/`
职责：
- 组件复用

分为：
- `components/common`：通用组件
- `components/business`：业务通用组件
- `components/order-debug`：订单调试专用组件

## 5. 配置规则

### 5.1 `config/env.ts`
职责：
- 环境事实
- 底层能力
- 网络层基础配置

要求：
- 显式手动控制当前环境
- 打开文件能直接看出当前项目跑的是哪套环境
- 不使用 `process.env`
- 不使用 `import.meta.env`

### 5.2 `config/app.ts`
职责：
- 业务配置
- 功能开关
- 产品策略配置

要求：
- 基于 env 能力做组合
- 不直接承担环境事实

## 6. 颜色与样式规则
当前项目已建立语义化颜色体系：
- `src/constants/colors.json`
- `src/constants/colors.ts`

要求：
- 优先使用语义化颜色 token
- 避免页面中继续散写大量魔法色值
- 页面背景统一使用 `background`
- 卡片统一使用 `card`
- 弱背景区按语义使用 `surface-muted / surface-soft / surface-warm`

## 7. 请求层规则
统一通过：
- `src/utils/request.ts`

要求：
- 不直接在页面里使用 `uni.request`
- 错误处理走统一请求层
- 请求日志由配置控制
- `BASE_URL / API_PREFIX / REQUEST_TIMEOUT` 由配置统一控制

## 8. 订单系统专项规则

### 8.1 状态规则
- 统一在 `src/utils/order.ts`
- 状态文案、状态说明、按钮逻辑、normalize 逻辑都在这里收口

### 8.2 本地状态同步
- 统一在 `src/hooks/useOrder.ts`
- 包括 `orderList` 与 `orderDetail` 同步

### 8.3 调试系统规则
- 调试系统是开发 / 测试工具，不是正式业务功能
- 调试系统必须受 `env.ts + app.ts` 双层控制
- 调试系统直接修改订单真实字段，不允许维护 `debugStatus / debugPayTime` 这类平行字段
- 如需快照，只允许最小化 `__debugMeta`

## 9. mock 规则
当前 mock 服务由以下文件提供：
- `server.js`
- `db.json`

要求：
- 页面不要直接依赖 mock 文件
- mock 结构尽量贴近真实后端
- mock 数据必须和当前 types / 业务字段保持一致

## 10. 文档维护规则
以下文档应持续同步更新：
- `README.md`
- `docs/project-context.md`
- `docs/project-rules.md`
- `docs/mock-api.md`
- `docs/order-flow.md`
- `docs/order-debug-toolkit.md`
- `docs/go-live-checklist.md`
- `docs/next-phase-todo.md`

## 11. 提交前自检
改代码前或改完后，至少自检：
- 是否破坏页面 -> hooks -> api/modules 分层
- 是否把业务模型和接口契约混写
- 是否把状态判断散到多个页面
- 是否把配置写死在页面或 utils 中
- 是否增加了无必要复杂度
- 是否仍能通过构建
