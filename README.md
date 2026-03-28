# Wine Market

Wine Market 是一个基于 uni-app + Vue 3 + TypeScript 的精品酒类商城前端项目。

当前项目重点是：
- 完整前端业务链路
- 清晰分层结构
- mock / test / real 可切换
- 为后续真实联调与上线做准备

## 技术栈
- uni-app
- Vue 3
- TypeScript
- Pinia
- Tailwind CSS
- Vite
- json-server + `server.js`

## 当前已具备的能力
- 首页、分类、商品列表、商品详情
- 购物车
- 确认订单与提交订单
- 订单列表、订单详情、支付页
- 取消订单、确认收货
- 评价、追评、匿名评价
- 再次购买
- 售后基础流程
- 订单调试工具
- 显式配置体系
- 语义化颜色体系

## 当前仍需继续开发的重点
- 用户系统完整闭环
- 商品搜索 / 筛选 / 排序 / 推荐
- 评论系统升级为按商品逐项评论
- 首页重做
- 真实微信支付接入
- 真实物流系统接入
- 真实后端联调与上线准备

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动 mock 服务

```bash
npm run mock
```

默认地址：
- `http://127.0.0.1:3000`

### 3. 启动前端开发

H5：

```bash
npm run dev:h5
```

微信小程序：

```bash
npm run dev:mp-weixin
```

### 4. 构建 H5

```bash
npm run build:h5
```

## 目录结构

```text
src/
  api/
    modules/
  components/
    business/
    common/
    order-debug/
  config/
  constants/
  hooks/
  pages/
    cart/
    goods/
    index/
    login/
    member/
    order/
  store/
  types/
    api/
    model/
  utils/
docs/
  project-rules.md
  mock-api.md
  order-flow.md
  order-debug-toolkit.md
  go-live-checklist.md
  next-phase-todo.md
server.js
db.json
```

## 当前配置说明

### 环境配置
文件：
- `src/config/env.ts`

特点：
- 当前环境为显式手动控制
- 不依赖 `process.env`
- 打开文件即可看到当前运行环境

### 业务配置
文件：
- `src/config/app.ts`

特点：
- 统一管理业务开关
- 包括订单调试系统相关开关

## 订单系统说明
订单相关页位于：
- `src/pages/order/list.vue`
- `src/pages/order/detail.vue`
- `src/pages/order/confirm.vue`
- `src/pages/order/pay.vue`
- `src/pages/order/comment.vue`
- `src/pages/order/aftersale.vue`
- `src/pages/order/debug.vue`

订单域规则主要收口在：
- `src/utils/order.ts`
- `src/hooks/useOrder.ts`

订单调试系统规则主要收口在：
- `src/utils/orderDebug.ts`
- `src/hooks/useOrderDebug.ts`

## mock 说明
当前项目默认依赖：
- `server.js`
- `db.json`

统一响应结构：

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

更多接口说明请看：
- [mock-api.md](/D:/uniapp/wine-market/docs/mock-api.md)

## 建议阅读顺序
如果是新接手项目，建议先读：
1. [project-rules.md](/D:/uniapp/wine-market/docs/project-rules.md)
2. [order-flow.md](/D:/uniapp/wine-market/docs/order-flow.md)
3. [order-debug-toolkit.md](/D:/uniapp/wine-market/docs/order-debug-toolkit.md)
4. [mock-api.md](/D:/uniapp/wine-market/docs/mock-api.md)
5. [go-live-checklist.md](/D:/uniapp/wine-market/docs/go-live-checklist.md)
6. [next-phase-todo.md](/D:/uniapp/wine-market/docs/next-phase-todo.md)

## 联调与上线
联调与上线前建议重点查看：
- [go-live-checklist.md](/D:/uniapp/wine-market/docs/go-live-checklist.md)
- [next-phase-todo.md](/D:/uniapp/wine-market/docs/next-phase-todo.md)
