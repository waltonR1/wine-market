可以，下面我直接给你一版 **适合放进 README 的内容**，并且带上**完整目录结构**。
你基本可以直接复制，再按你自己的项目细节微调。

---

# `README.md` 示例

````md
# wine-market

一个基于 **uni-app + Vue 3 + TypeScript** 的商城项目，当前采用 **本地 mock 数据** 进行前后端解耦开发，后续可平滑切换到真实接口。

---

## 技术栈

- uni-app
- Vue 3
- TypeScript
- Vite
- Tailwind CSS
- Pinia（如已使用）
- 本地 Mock 数据

---

## 项目目录结构

```text
wine-market/
├─ .idea/
├─ dist/
├─ node_modules/
├─ src/
│  ├─ api/
│  │  ├─ modules/
│  │  │  ├─ cart.ts
│  │  │  ├─ goods.ts
│  │  │  ├─ index.ts
│  │  │  ├─ member.ts
│  │  │  ├─ order.ts
│  │  │  └─ user.ts
│  │  └─ index.ts
│  │
│  ├─ assets/
│  │  ├─ icon/
│  │  ├─ images/
│  │  └─ logo.png
│  │
│  ├─ components/
│  │  ├─ business/
│  │  │  ├─ OrderCard.vue
│  │  │  ├─ ProductCard.vue
│  │  │  └─ ProductList.vue
│  │  └─ common/
│  │     ├─ Empty.vue
│  │     ├─ Loading.vue
│  │     ├─ Navbar.vue
│  │     └─ Tabbar.vue
│  │
│  ├─ config/
│  │  ├─ app.ts
│  │  └─ env.ts
│  │
│  ├─ constants/
│  │  ├─ colors.ts
│  │  ├─ index.ts
│  │  └─ routes.ts
│  │
│  ├─ hooks/
│  │  ├─ useCart.ts
│  │  ├─ useGoods.ts
│  │  └─ useUser.ts
│  │
│  ├─ mock/
│  │  ├─ cart.ts
│  │  ├─ goods.ts
│  │  ├─ index.ts
│  │  ├─ member.ts
│  │  ├─ order.ts
│  │  └─ user.ts
│  │
│  ├─ pages/
│  │  ├─ cart/
│  │  │  └─ index.vue
│  │  ├─ goods/
│  │  │  ├─ category.vue
│  │  │  ├─ detail.vue
│  │  │  └─ list.vue
│  │  ├─ index/
│  │  │  └─ index.vue
│  │  ├─ login/
│  │  │  └─ index.vue
│  │  ├─ member/
│  │  │  └─ index.vue
│  │  └─ order/
│  │     ├─ confirm.vue
│  │     └─ list.vue
│  │
│  ├─ store/
│  │  ├─ cart.ts
│  │  ├─ index.ts
│  │  ├─ order.ts
│  │  └─ user.ts
│  │
│  ├─ types/
│  │  ├─ api/
│  │  ├─ model/
│  │  │  ├─ cart.ts
│  │  │  ├─ goods.ts
│  │  │  ├─ member.ts
│  │  │  ├─ order.ts
│  │  │  └─ user.ts
│  │  └─ common.ts
│  │
│  ├─ utils/
│  │  ├─ auth.ts
│  │  ├─ format.ts
│  │  ├─ request.ts
│  │  ├─ storage.ts
│  │  └─ validate.ts
│  │
│  ├─ App.vue
│  ├─ main.ts
│  ├─ manifest.json
│  ├─ pages.json
│  ├─ shime-uni.d.ts
│  ├─ shims-uni.d.ts
│  └─ uni.scss
│
├─ .gitignore
├─ index.html
├─ package.json
├─ package-lock.json
├─ README.md
├─ tailwind.config.js
├─ tsconfig.json
└─ vite.config.js
````

---

## 目录说明

### `src/api`

接口层，按业务模块封装 API 方法。

* `modules/*.ts`：按业务拆分接口，如商品、订单、用户、购物车
* `api/index.ts`：统一导出接口

---

### `src/mock`

本地 Mock 数据层，用于前后端解耦开发。

* 与 `api/modules` 尽量按业务一一对应
* 页面不直接依赖 mock
* 由 `api` 决定当前使用 mock 还是真实接口

---

### `src/pages`

页面层，负责页面展示、交互和页面级逻辑。

例如：

* 首页
* 商品列表页
* 商品详情页
* 登录页
* 购物车页
* 订单页
* 个人中心页

---

### `src/components`

组件层。

* `common/`：通用组件，如加载、空状态、导航栏、TabBar
* `business/`：业务组件，如商品卡片、订单卡片、商品列表

---

### `src/hooks`

组合式逻辑封装层，用于复用响应式业务逻辑。

例如：

* `useGoods`：商品列表/详情逻辑
* `useCart`：购物车逻辑
* `useUser`：用户信息逻辑

---

### `src/store`

状态管理层，负责跨页面共享状态。

例如：

* 用户状态
* 购物车状态
* 订单相关状态

---

### `src/types`

类型定义层。

* `types/model`：业务实体类型
* `types/api`：接口请求/响应类型
* `types/common.ts`：通用公共类型

---

### `src/utils`

工具函数层。

例如：

* 请求封装
* 本地存储
* 鉴权辅助
* 数据格式化
* 表单校验

---

### `src/config`

项目配置层。

例如：

* 环境配置
* mock 开关
* baseURL
* 应用基础配置

---

### `src/constants`

静态常量层。

例如：

* 路由常量
* 颜色常量
* 状态映射
* 固定配置项

---

## 数据流说明

项目推荐的数据流如下：

```text
pages -> hooks -> api -> request/mock
             ↓
           store
```

说明：

* `pages` 负责页面展示与用户交互
* `hooks` 负责复用业务逻辑
* `api` 负责统一接口调用
* `request/mock` 负责真实请求或本地假数据
* `store` 负责跨页面共享状态

---

## 开发规范

### 1. 页面层

`pages` 只负责页面展示、交互和页面生命周期，不直接堆积复杂业务逻辑。

### 2. 组件层

* 通用组件放 `components/common`
* 业务复用组件放 `components/business`
* 页面私有组件后续可放 `pages/xxx/components`

### 3. hooks 层

`hooks` 只放可复用的响应式业务逻辑，不作为杂物目录。

### 4. api 层

统一通过 `api` 调用接口，不在页面中直接写大量请求代码。

### 5. mock 层

mock 只负责提供假数据或假实现，不让页面直接依赖。

### 6. store 层

只有跨页面共享的数据才进入 store，页面私有状态不放 store。

### 7. types 层

* 业务实体类型放 `types/model`
* 接口请求/响应类型放 `types/api`

---

## 用户与会员模块划分

### `user`

负责：

* 登录
* token
* 当前登录用户信息
* 退出登录
* 身份认证相关逻辑

### `member`

负责：

* 个人中心展示
* 收藏、优惠券、地址等会员业务
* 积分、等级、权益等扩展信息

---

## Mock 切换说明

开发阶段默认可以通过配置控制是否启用 mock。

示例思路：

```ts
// src/config/env.ts
export const IS_MOCK = true
```

然后在接口层统一处理：

```ts
if (IS_MOCK) {
  return mockGetGoodsList()
}
return request(...)
```

这样在联调或切换正式接口时，页面层无需改动。

---

## 启动项目

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev:mp-weixin
```

或根据 uni-app 平台命令启动对应端。