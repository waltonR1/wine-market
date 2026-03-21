# Mock API

Mock 服务由根目录 `server.js + db.json` 提供，默认地址：

- http://127.0.0.1:3000

统一响应：

```json
{ "code": 0, "message": "ok", "data": {} }
```

## Goods

- `GET /goods`
  - 商品列表（用于列表/首页）
- `GET /goods/:id`
  - 商品详情（用于详情页三 Tab）
  - 返回字段包含：
    - `stock: number`
    - `detail: { type: 'title' | 'text' | 'image'; value: string }[]`
    - `params: { label: string; value: string }[]`
    - `comments: { id; userName; avatar; score; content; time; images? }[]`

## Cart

- `GET /cart`
- `POST /cart`
  - body: `{ id: number, count: number }`
- `POST /cart/:id`
  - 更新数量（微信小程序不支持 PATCH）
  - body: `{ count: number }`
- `DELETE /cart/:id`
- `DELETE /cart`

## Address

- `GET /addresses`
- `GET /addresses/default`
- `POST /addresses`
- `POST /addresses/:id`
- `POST /addresses/:id/default`
- `DELETE /addresses/:id`

## Orders

- `GET /orders`
- `GET /orders/:id`
- `GET /order_confirm_list`
