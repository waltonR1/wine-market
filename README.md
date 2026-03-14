# Wine Market 精品酒馆

一个基于 **uni-app + Vue 3 + TypeScript** 的精品酒类商城项目。

---

## 项目特色

- **前后端全解耦**：基于 `json-server 1.x` 搭建 Mock 后端，支持真实接口平滑切换。
- **大数据量适配**：
  - **无限滚动**：支持分页加载与触底自动预加载（阈值 200px）。
  - **感官性能**：内置列表/宫格双模式骨架屏，提升加载体验。
  - **图片优化**：支持图片懒加载与占位图机制。
- **工程化标准**：
  - **环境管理**：一键切换 MOCK/真实 环境，支持全局业务配置。
  - **网络封装**：自动化 Loading 管理、统一错误拦截、请求日志追踪。
  - **代码规范**：严格的 TypeScript 类型约束与分层架构。

---

## 技术栈

本项目基于以下核心技术构建：

- **框架**：[uni-app](https://uniapp.dcloud.net.cn/) (Vue 3 + Vite) - 全端通用的开发框架。
- **状态管理**：[Pinia](https://pinia.vuejs.org/) - 现代、轻量级的状态管理库。
- **样式**：[Tailwind CSS](https://tailwindcss.com/) (针对 uni-app 优化的原子化 CSS)。
- **语言**：[TypeScript](https://www.typescriptlang.org/) - 强类型约束，提升代码健壮性。
- **后端模拟**：[json-server 1.x](https://github.com/typicode/json-server) - 快速搭建 RESTful API Mock。

---

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动 Mock 服务 (后端)
项目根目录已配置 `db.json`，需先启动 json-server：
```bash
# 如果全局安装了 json-server
json-server db.json --port 3000

# 或者使用项目内置脚本 (如有配置)
npm run mock
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

此外，`APP_CONFIG` 提供了以下可配置项：
- `ENABLE_LOG`: 是否在控制台打印请求/响应日志。
- `SERVICE_PHONE`: 全局客服电话。
- `DEFAULT_PAGE_SIZE`: 默认分页条数。

---

## 项目目录结构

```text
src/
├─ api/             # 接口层
│  ├─ modules/      # 按业务拆分的接口模块 (goods, order, user...)
│  └─ index.ts      # 统一导出
├─ config/          # 配置层 (env.ts 环境配置, api.ts 路径配置)
├─ components/      # 组件层
│  ├─ business/     # 业务组件 (ProductCard, OrderCard...)
│  └─ common/       # 公共组件 (Empty, Loading...)
├─ pages/           # 页面层
├─ types/           # 类型定义 (api 请求响应, model 业务模型)
├─ utils/           # 工具类 (request.ts 网络封装, auth.ts 权限...)
└─ db.json          # Mock 数据库文件 (json-server 使用)
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
