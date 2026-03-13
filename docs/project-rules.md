# wine-market 项目规范清单

## 一、目录职责总原则

每一层只做自己的事，不跨层乱写。

数据流尽量保持为：

```txt
pages -> hooks -> api -> request/mock
             ↓
           store
```

含义：

* `pages` 负责页面展示和页面交互
* `hooks` 负责复用业务逻辑
* `api` 负责接口调用
* `mock` 负责本地假数据
* `store` 负责跨页面共享状态

---

## 二、各目录放什么

---

### 1. `pages/`

**作用：页面文件，只负责页面级展示和交互。**

适合放：

* 页面结构
* 页面事件
* 页面生命周期
* 调用 hooks / store / api
* 页面局部状态

不适合放：

* 大量可复用业务逻辑
* 通用工具函数
* 直接写一堆请求封装
* 跨页面共享状态

规则：

* 一个页面目录下至少有一个 `index.vue` 或具体页面文件
* 同一业务页面放在同一目录下，例如 `goods/`、`order/`
* 页面专用的小组件，后期可以放 `pages/xxx/components/`

---

### 2. `components/common/`

**作用：通用组件。**

适合放：

* `Loading.vue`
* `Empty.vue`
* `Navbar.vue`
* `Tabbar.vue`

规则：

* 不依赖具体业务含义
* 多个页面都可复用
* 输入输出尽量通用化

不适合放：

* 明显只服务某个业务的组件

---

### 3. `components/business/`

**作用：业务通用组件。**

适合放：

* `ProductCard.vue`
* `ProductList.vue`
* `OrderCard.vue`

规则：

* 带业务语义，但可在多个页面复用
* 尽量通过 `props` 控制展示
* 尽量不要直接耦合具体页面逻辑

不适合放：

* 只在一个页面使用、耦合页面细节很深的组件
  这种后期应放到 `pages/xxx/components/`

---

### 4. `hooks/`

**作用：组合式复用逻辑。**

适合放：

* 商品列表获取逻辑
* 用户信息读取逻辑
* 购物车增删改查逻辑
* loading / error / refresh 等组合逻辑

规则：

* 文件名统一使用 `useXxx.ts`
* hook 主要返回：

    * 数据
    * 状态
    * 方法
* hook 内可以调 `api`、`store`
* hook 不负责纯 UI

不适合放：

* 纯工具函数
* 与 Vue 响应式无关的普通函数
* 大量静态配置

示例：

```ts
useGoods()
useCart()
useUser()
```

---

### 5. `api/modules/`

**作用：按业务模块封装接口。**

适合放：

* 商品接口
* 订单接口
* 用户接口
* 购物车接口
* 会员接口

规则：

* 一个文件对应一个业务模块
* 一个函数对应一个接口能力
* 命名尽量用动词开头，例如：

    * `getGoodsList`
    * `getGoodsDetail`
    * `createOrder`
    * `login`

不适合放：

* 页面逻辑
* UI 状态
* 大量数据格式化逻辑

---

### 6. `api/index.ts`

**作用：接口统一出口。**

规则：

* 只做导出聚合
* 不写具体业务逻辑

例如：

```ts
export * from './modules'
```

---

### 7. `mock/`

**作用：本地模拟数据或模拟接口。**

适合放：

* 商品 mock 数据
* 用户 mock 数据
* 订单 mock 数据
* 购物车 mock 数据

规则：

* 与 `api/modules` 尽量按业务一一对应
* mock 层尽量简单
* 重点是“提供假数据”，不是模拟完整后端系统

建议：

* 页面不要直接依赖 `mock`
* 由 `api` 决定当前使用 mock 还是真接口

---

### 8. `store/`

**作用：跨页面共享状态。**

适合放：

* 当前登录用户
* 购物车数量/列表
* 订单确认临时数据

规则：

* 只有“多个页面共享”的状态才放 store
* 页面私有状态不要硬塞到 store
* store 负责状态，不负责接口替代层

不适合放：

* 所有列表数据
* 一次性页面临时变量
* 与某个单独组件强绑定的数据

---

### 9. `types/model/`

**作用：业务实体类型。**

适合放：

* `Goods`
* `CartItem`
* `Order`
* `User`
* `Member`

规则：

* 描述“系统里有什么对象”
* 不关心某个具体接口怎么传
* 命名清晰，贴近业务

示例：

```ts
export interface GoodsItem {}
export interface UserInfo {}
export interface OrderItem {}
```

---

### 10. `types/api/`

**作用：接口请求与响应类型。**

适合放：

* 请求参数类型
* 响应结果类型
* 分页返回结构

规则：

* 描述“接口怎么收、怎么回”
* 不和 `model` 混写

示例：

```ts
export interface GetGoodsListParams {}
export interface GetGoodsListResponse {}
export interface LoginParams {}
export interface LoginResponse {}
```

---

### 11. `types/common.ts`

**作用：公共类型。**

适合放：

* 分页泛型
* 通用响应结构
* 可复用枚举类型
* 统一 ID 类型别名

例如：

```ts
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
```

---

### 12. `utils/`

**作用：纯工具函数。**

适合放：

* 请求实例封装 `request.ts`
* 本地存储 `storage.ts`
* 格式化方法 `format.ts`
* 校验方法 `validate.ts`
* 鉴权辅助 `auth.ts`

规则：

* 尽量纯函数化
* 不依赖页面
* 少放业务语义太强的内容

不适合放：

* 页面流程逻辑
* 某个业务专属处理链

---

### 13. `config/`

**作用：项目配置。**

适合放：

* 环境变量读取
* mock 开关
* baseURL
* 应用名
* 版本号
* 默认配置项

规则：

* 配置集中管理
* 页面不要写死环境信息

---

### 14. `constants/`

**作用：静态常量。**

适合放：

* 路由常量
* 颜色常量
* 状态映射
* tab 配置
* 文案枚举

规则：

* 静态、固定、不会频繁变化
* 和运行环境无关

区别于 `config`：

* `config` 更偏“项目配置”
* `constants` 更偏“静态常量”

---

## 三、命名规范

### 文件命名

建议保持统一：

* 页面组件：`index.vue` / `detail.vue`
* 通用组件：`PascalCase.vue`
* hook：`useXxx.ts`
* store：按业务命名，如 `user.ts`
* api 模块：按业务命名，如 `goods.ts`
* 类型文件：按业务命名，如 `user.ts`, `order.ts`

---

### 方法命名

建议：

* 获取：`getXxx`
* 创建：`createXxx`
* 更新：`updateXxx`
* 删除：`deleteXxx`
* 登录：`login`
* 登出：`logout`

不要同一项目里一会儿 `fetchGoods`，一会儿 `getGoodsList`，最好统一风格。

---

### 类型命名

建议：

* 实体类型：`UserInfo`、`GoodsItem`、`OrderItem`
* 请求类型：`GetGoodsListParams`
* 响应类型：`GetGoodsListResponse`

---

## 四、分层边界规则

### 1. 页面不要直接写复杂请求细节

不推荐：

```ts
uni.request(...)
```

推荐：

```ts
import { getGoodsList } from '@/api'
```

---

### 2. 页面不要直接操作 mock

不推荐：

```ts
import { mockGoodsList } from '@/mock'
```

推荐由 `api` 决定底层来源。

---

### 3. hook 不要沦为杂物间

不是所有函数都丢进 `hooks`。
只有“可复用的响应式业务逻辑”才进 `hooks`。

---

### 4. utils 不写页面业务

`utils` 是工具箱，不是业务层。

---

### 5. store 不替代数据库

store 只保存前端共享状态，不负责长期数据管理逻辑。

---

## 五、`user` 和 `member` 的边界

### `user`

负责：

* 登录
* token
* 当前登录身份
* 基础用户信息
* 登出

### `member`

负责：

* 会员中心页展示
* 收藏、优惠券、地址
* 积分、等级、权益
* “我的”页面的扩展业务

规则：

* 身份认证归 `user`
* 会员中心业务归 `member`

---

## 六、mock 切换规范

建议项目统一由配置控制是否启用 mock，例如：

```ts
// config/env.ts
export const IS_MOCK = true
```

然后在 `api` 里决定：

```ts
if (IS_MOCK) {
  return mockGetGoodsList()
}
return request(...)
```

这样以后联调时，页面不用改。

---

## 七、什么时候该新建目录

### 需要新建 `pages/xxx/components/` 的情况

当某页面有很多只属于该页面的组件时。

### 需要考虑 `services/` 的情况

当一个业务动作需要：

* 调多个接口
* 做复杂数据拼装
* 不适合写在 page / hook / api 中

当前项目还不一定需要。

---

## 八、开发时自检清单

每次新增代码前先问自己：

1. 这是页面展示，还是可复用逻辑？
2. 这是共享状态，还是页面私有状态？
3. 这是业务实体类型，还是接口类型？
4. 这是静态常量，还是项目配置？
5. 这个组件是通用组件，还是业务组件，还是页面私有组件？
6. 这个函数该放 `hooks`、`utils`、还是 `api`？

只要你每次都这样判断，项目基本不会乱。