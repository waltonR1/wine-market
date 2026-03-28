# Mock API 文档

更新时间：2026-03-28

## 1. Mock 服务说明
当前 mock 服务由以下文件提供：
- `server.js`
- `db.json`

默认地址：
- `http://127.0.0.1:3000`

启动命令：

```bash
npm run mock
```

## 2. 统一响应结构
当前 mock 服务统一返回：

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

说明：
- `code = 0` 表示成功
- `code != 0` 表示失败
- `message` 为提示信息
- `data` 为业务数据

## 3. Goods

### 3.1 获取商品列表
- `GET /goods`

用途：
- 商品列表页
- 首页商品推荐区

### 3.2 获取商品详情
- `GET /goods/:id`

要求返回的关键字段：
- `stock`
- `detail`
- `params`
- `comments`

用途：
- 商品详情页
- 评论区展示

## 4. Cart

### 4.1 获取购物车
- `GET /cart`

### 4.2 加入购物车
- `POST /cart`

请求体：

```json
{
  "id": 1,
  "count": 2
}
```

### 4.3 更新购物车商品数量
- `POST /cart/:id`

请求体：

```json
{
  "count": 3
}
```

说明：
- 当前统一使用 `POST` 更新，避免小程序端 `PATCH` 兼容问题

### 4.4 删除购物车商品
- `DELETE /cart/:id`

### 4.5 清空购物车
- `DELETE /cart`

## 5. Address

### 5.1 获取地址列表
- `GET /addresses`

### 5.2 获取默认地址
- `GET /addresses/default`

### 5.3 新增地址
- `POST /addresses`

### 5.4 编辑地址
- `POST /addresses/:id`

### 5.5 设为默认地址
- `POST /addresses/:id/default`

### 5.6 删除地址
- `DELETE /addresses/:id`

## 6. Orders

### 6.1 获取确认订单商品
- `GET /order_confirm_list`

### 6.2 获取订单列表
- `GET /orders`

### 6.3 提交订单
- `POST /orders/submit`

### 6.4 获取订单详情
- `GET /order/:id/detail`

说明：
- 当前 mock 仍使用单数路径 `/order/:id/detail`

### 6.5 支付订单
- `POST /order/pay`

### 6.6 取消订单
- `POST /orders/:id/cancel`

### 6.7 确认收货
- `POST /orders/:id/confirm`

### 6.8 删除订单
- `DELETE /orders/:id`

### 6.9 再次购买
- `POST /orders/:id/rebuy`

### 6.10 提交评价 / 追评
- `POST /orders/:id/comment`

### 6.11 发起售后
- `POST /orders/:id/after-sale`

### 6.12 推进售后状态
- `POST /orders/:id/after-sale/advance`

## 7. Order Debug Toolkit

### 7.1 获取订单调试信息
- `GET /orders/:id/debug`

返回内容包括：
- 当前订单
- 是否已有快照
- 当前允许推进的下一状态
- 状态机信息

### 7.2 执行订单调试动作
- `POST /orders/:id/debug`

请求体关键字段：

```json
{
  "id": "xxx",
  "action": "transition"
}
```

当前支持的主要动作包括：
- `transition`
- `jump`
- `applyPreset`
- `reset`
- `delete`
- `updateTimeline`
- `simulatePaySuccess`
- `simulatePayFailure`
- `simulatePayClose`
- `simulateDelivery`
- `updateLogistics`
- `simulateReceive`
- `simulateComplete`
- `cancelByUser`
- `cancelBySystem`
- `cancelByTimeout`
- `startRefund`
- `refundProcessing`
- `refundSuccess`
- `refundFailure`
- `afterSaleProcessing`
- `afterSaleComplete`

说明：
- 调试系统直接写回订单真实字段
- 不应依赖 `debugStatus / debugPayTime` 这类平行字段

## 8. Member / User
当前 mock 中已存在或预留的资源包括：
- `member_profile`
- `member_wallet`
- `coupons`
- `point-records`
- `favorites`
- `footprints`
- `invoices`
- `realname`
- `user_login`
- `user_info`

说明：
- 部分页面已接入
- 部分页面仍属于后续补全范围

## 9. 当前 mock 的使用原则
- 页面层不直接依赖 mock 文件
- 页面层只通过 hooks 调业务
- hooks 通过 `api/modules` 间接访问 mock
- mock 字段结构必须与当前业务模型同步

## 10. 后续维护建议
后续每次调整 mock 时，至少同步检查：
- `server.js`
- `db.json`
- `src/types/model/*`
- `src/types/api/*`
- `src/api/modules/*`
- `docs/order-flow.md`

避免出现：
- 文档写一套
- mock 返回一套
- TS 类型又是一套
