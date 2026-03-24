# Wine Market 精品酒馆

一个基于 **uni-app + Vue 3 + TypeScript** 的精品酒类商城项目。

---

## 项目特色

- **前后端全解耦**：基于 `server.js + db.json + json-server` 搭建 Mock 后端，支持真实接口平滑切换。
- **大数据量适配**：
  - **无限滚动**：支持分页加载与触底自动预加载（阈值 200px）。
  - **感官性能**：内置列表/宫格双模式骨架屏，提升加载体验。
  - **图片优化**：支持图片懒加载与占位图机制。
- **工程化标准**：
  - **环境管理**：一键切换 MOCK/真实 环境，支持全局业务配置。
  - **网络封装**：自动化 Loading 管理、统一错误拦截、请求日志追踪。
  - **代码规范**：严格的 TypeScript 类型约束与分层架构。
- **商品详情完善**：库存展示 + 「图文详情 / 商品参数 / 买家评论」三 Tab。
- **下单链路**：详情页“立即购买”写入确认订单临时数据并跳转确认页。

---

## 技术栈

本项目基于以下核心技术构建：

- **框架**：[uni-app](https://uniapp.dcloud.net.cn/) (Vue 3 + Vite) - 全端通用的开发框架。
- **状态管理**：[Pinia](https://pinia.vuejs.org/) - 现代、轻量级的状态管理库。
- **样式**：[Tailwind CSS](https://tailwindcss.com/) (针对 uni-app 优化的原子化 CSS)。
- **语言**：[TypeScript](https://www.typescriptlang.org/) - 强类型约束，提升代码健壮性。
- **后端模拟**：[json-server](https://github.com/typicode/json-server) - 本项目用 `server.js` 包装 json-server 实现统一响应与业务路由。

---

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动 Mock 服务 (后端)
项目根目录使用 `server.js + db.json` 提供 Mock API（统一响应 `{ code, message, data }`）：
```bash
npm run mock
```
默认端口 `3000`，可通过环境变量覆盖：
```bash
# Windows PowerShell
$env:PORT=3001; npm run mock
```

### 3. 启动前端项目
```bash
# 微信小程序端
npm run dev:mp-weixin

# H5端
npm run dev:h5
```

---

## 环境配置 (`src/config/env.ts`)

你可以通过修改 `IS_MOCK` 变量来切换环境：

```typescript
// true: 使用 json-server (127.0.0.1:3000)
// false: 使用生产环境 API (自动添加 /api/v1 前缀)
export const IS_MOCK = true 
```

## Mock 约定

- **微信小程序不支持 PATCH**：需要更新资源时统一用 `POST`（例如购物车更新数量）。
- **商品详情数据结构**：`GET /goods/:id` 返回包含 `stock / params / detail / comments`，用于详情页的三 Tab 展示。
- **立即购买**：详情页会写入 `store/order` 的确认订单临时数据后跳转 `pages/order/confirm`。

此外，`APP_CONFIG` 提供了以下可配置项：
- `ENABLE_LOG`: 是否在控制台打印请求/响应日志。
- `SERVICE_PHONE`: 全局客服电话。
- `DEFAULT_PAGE_SIZE`: 默认分页条数。

---

## 项目目录结构

```text
.
├── LICENSE
├── README.md
├── db.json         # Mock 数据库文件 (json-server 使用)
├── docs
│   ├── mock-api.md
│   └── project-rules.md
├── index.html
├── package-lock.json
├── package.json
├── shims-uni.d.ts
├── src
│   ├── App.vue
│   ├── api                      # 接口层
│   │   ├── index.ts             # 统一导出
│   │   └── modules              # 按业务拆分的接口模块 (goods, order, user...)
│   │       ├── cart.ts
│   │       ├── goods.ts
│   │       ├── index.ts
│   │       ├── member.ts
│   │       ├── order.ts
│   │       └── user.ts
│   ├── assets
│   │   └── logo.png
│   ├── components                # 组件层
│   │   ├── business              # 业务组件 (ProductCard, OrderCard...)
│   │   │   ├── OrderCard.vue
│   │   │   ├── ProductCard.vue
│   │   │   └── ProductList.vue
│   │   └── common                # 公共组件 (Empty, Loading...)
│   │       ├── Empty.vue
│   │       ├── Loading.vue
│   │       ├── Navbar.vue
│   │       └── Tabbar.vue
│   ├── config                    # 配置层 (env.ts 环境配置, api.ts 路径配置)
│   │   ├── api.ts
│   │   ├── app.ts
│   │   └── env.ts
│   ├── constants
│   │   ├── colors.json
│   │   ├── colors.ts
│   │   ├── index.ts
│   │   └── routes.ts
│   ├── hooks
│   │   ├── useCart.ts
│   │   ├── useGoods.ts
│   │   └── useUser.ts
│   ├── main.ts
│   ├── manifest.json
│   ├── pages                      # 页面层
│   │   ├── cart
│   │   │   └── index.vue
│   │   ├── goods
│   │   │   ├── category.vue
│   │   │   ├── detail.vue
│   │   │   └── list.vue
│   │   ├── index
│   │   │   └── index.vue
│   │   ├── login
│   │   │   └── index.vue
│   │   ├── member
│   │   │   ├── address.vue
│   │   │   ├── collection.vue
│   │   │   ├── coupons.vue
│   │   │   ├── footprints.vue
│   │   │   ├── index.vue
│   │   │   ├── info.vue
│   │   │   ├── invoice.vue
│   │   │   ├── points.vue
│   │   │   ├── promotion.vue
│   │   │   ├── realname.vue
│   │   │   ├── settings.vue
│   │   │   ├── share.vue
│   │   │   └── wallet.vue
│   │   └── order
│   │       ├── confirm.vue
│   │       └── list.vue
│   ├── pages.json
│   ├── shime-uni.d.ts
│   ├── store
│   │   ├── cart.ts
│   │   ├── index.ts
│   │   ├── order.ts
│   │   └── user.ts
│   ├── types                   # 类型定义 (api 请求响应, model 业务模型)
│   │   ├── api
│   │   │   ├── cart.ts
│   │   │   ├── goods.ts
│   │   │   ├── member.ts
│   │   │   ├── order.ts
│   │   │   └── user.ts
│   │   ├── common.ts
│   │   └── model
│   │       ├── cart.ts
│   │       ├── goods.ts
│   │       ├── member.ts
│   │       ├── order.ts
│   │       └── user.ts
│   ├── uni.scss
│   └── utils                 # 工具类 (request.ts 网络封装, auth.ts 权限...)
│       ├── auth.ts
│       ├── format.ts
│       ├── permission.ts
│       ├── request.ts
│       ├── storage.ts
│       └── validate.ts
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 开发规范

### 网络请求
统一使用 `request` 函数，支持自动 Loading：
```typescript
getGoodsList(params, { loading: true, loadingText: '加载中...' })
```

### 页面分页
页面需配置 `onReachBottomDistance: 200` 以实现无缝滚动。详情请参考 `pages.json`。

---

## 许可证
MIT License
