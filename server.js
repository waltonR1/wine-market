const jsonServer = require('json-server')
const path = require('path')

const PORT = Number(process.env.PORT || 3000)
const DB_PATH = path.join(__dirname, 'db.json')

const ORDER_STATUS_TEXT = {
  1: '待付款',
  2: '待发货',
  3: '待收货',
  4: '待评价',
  6: '已关闭',
}

const AFTER_SALE_STATUS_TEXT = {
  applying: '申请已提交',
  reviewing: '平台审核中',
  approved: '审核通过',
  refunding: '退款处理中',
  completed: '售后完成',
  rejected: '售后已拒绝',
}

const server = jsonServer.create()
const router = jsonServer.router(DB_PATH)
const middlewares = jsonServer.defaults()

function ok(data, message = 'ok') {
  return { code: 0, message, data }
}

function fail(message, data = null) {
  return { code: 1, message, data }
}

server.use(middlewares)
server.use(jsonServer.bodyParser)

router.render = (req, res) => {
  if (res.statusCode >= 400) {
    const message = res.statusCode === 404 ? '资源不存在' : '请求失败'
    res.status(200).jsonp(fail(message))
    return
  }

  res.status(200).jsonp(ok(res.locals.data))
}

function formatDateTime(date = new Date()) {
  const pad = value => String(value).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hour = pad(date.getHours())
  const minute = pad(date.getMinutes())
  return `${year}-${month}-${day} ${hour}:${minute}`
}

function normalizeGoodsComment(comment = {}) {
  return {
    id: Number(comment.id || Date.now()),
    userName: String(comment.userName || '酒友'),
    avatar: String(comment.avatar || 'https://placehold.co/80x80/6B0F1A/FFFFFF.png?text=U'),
    score: Number(comment.score || 0),
    content: String(comment.content || ''),
    time: String(comment.time || ''),
    anonymous: Boolean(comment.anonymous),
    orderId: String(comment.orderId || ''),
    images: Array.isArray(comment.images) ? comment.images : [],
    appendTime: String(comment.appendTime || ''),
    appendContent: String(comment.appendContent || ''),
    appendImages: Array.isArray(comment.appendImages) ? comment.appendImages : [],
  }
}

function normalizeGoodsDetail(goods = {}) {
  const sales = Number(goods.sales || 0)
  const stock = Number.isFinite(Number(goods.stock))
    ? Number(goods.stock)
    : Math.max(0, 200 - Math.floor(sales / 50))

  const params = Array.isArray(goods.params)
    ? goods.params
    : [
        { label: '产区', value: goods.region || '' },
        { label: '类型', value: goods.type || '' },
        { label: '酒精度', value: goods.alcohol || '' },
      ].filter(item => item.value)

  const detail = Array.isArray(goods.detail)
    ? goods.detail
    : [
        { type: 'title', value: '酒品介绍' },
        { type: 'text', value: goods.description || '' },
        { type: 'image', value: goods.image || '' },
      ].filter(item => item.value)

  let comments = Array.isArray(goods.comments) ? goods.comments.map(normalizeGoodsComment) : []
  if (comments.length === 0 && Number(goods.comment || 0) > 0) {
    const count = Math.min(2, Number(goods.comment || 0))
    comments = Array.from({ length: count }).map((_, index) =>
      normalizeGoodsComment({
        id: goods.id * 10 + index + 1,
        userName: index === 0 ? '酒友A' : '酒友B',
        score: 5,
        content: index === 0 ? '果香干净，口感平衡，适合聚餐分享。' : '包装不错，送礼也很合适。',
        time: '2026-03-20',
      })
    )
  }

  return {
    ...goods,
    stock,
    params,
    detail,
    comments,
    comment: comments.length,
  }
}

function getDb() {
  return router.db
}

function getOrderCloseReason(order = {}) {
  if (order.closeReason) return order.closeReason
  if (Number(order.status) !== 6) return ''
  return order.commentTime ? 'commented' : 'cancelled'
}

function getOrderStatusLabel(status) {
  return ORDER_STATUS_TEXT[Number(status)] || ''
}

function getOrderStatusDesc(order = {}) {
  const closeReason = getOrderCloseReason(order)
  if (order.afterSaleStatus && order.afterSaleStatus !== 'none') {
    return AFTER_SALE_STATUS_TEXT[order.afterSaleStatus] || '售后处理中'
  }

  if (Number(order.status) === 6 && closeReason === 'commented') {
    return '订单已评价并关闭'
  }

  if (Number(order.status) === 6 && closeReason === 'cancelled') {
    return '订单已取消并关闭'
  }

  return {
    1: '请尽快完成支付',
    2: '商家正在备货中',
    3: '商品已发出，请注意查收',
    4: '订单已完成，等待评价',
    6: '订单已关闭',
  }[Number(order.status)] || ''
}

function normalizeOrder(order = {}) {
  return {
    ...order,
    statusLabel: getOrderStatusLabel(order.status),
    statusDesc: getOrderStatusDesc(order),
    closeReason: getOrderCloseReason(order),
    commentAnonymous: Boolean(order.commentAnonymous),
    commentImages: Array.isArray(order.commentImages) ? order.commentImages : [],
    appendCommentTime: String(order.appendCommentTime || ''),
    appendCommentContent: String(order.appendCommentContent || ''),
    appendCommentImages: Array.isArray(order.appendCommentImages) ? order.appendCommentImages : [],
    afterSaleStatus: order.afterSaleStatus || 'none',
    afterSaleType: String(order.afterSaleType || ''),
    afterSaleReason: String(order.afterSaleReason || ''),
    afterSaleApplyTime: String(order.afterSaleApplyTime || ''),
    afterSaleHandleTime: String(order.afterSaleHandleTime || ''),
    afterSaleCompleteTime: String(order.afterSaleCompleteTime || ''),
    afterSaleRejectReason: String(order.afterSaleRejectReason || ''),
    afterSaleTimeline: Array.isArray(order.afterSaleTimeline) ? order.afterSaleTimeline : [],
  }
}

function createOrderStatePatch(status, extra = {}) {
  return {
    status: Number(status),
    statusLabel: getOrderStatusLabel(status),
    payTime: '',
    deliveryTime: '',
    finishTime: '',
    cancelTime: '',
    commentTime: '',
    closeReason: '',
    commentScore: 0,
    commentContent: '',
    commentAnonymous: false,
    commentImages: [],
    appendCommentTime: '',
    appendCommentContent: '',
    appendCommentImages: [],
    logisticsCompany: '',
    logisticsNo: '',
    logisticsStatusText: '暂无物流信息',
    afterSaleStatus: 'none',
    afterSaleType: '',
    afterSaleReason: '',
    afterSaleApplyTime: '',
    afterSaleHandleTime: '',
    afterSaleCompleteTime: '',
    afterSaleRejectReason: '',
    afterSaleTimeline: [],
    ...extra,
  }
}

function generateOrderNum(db) {
  const orders = db.get('orders').value() || []
  const now = new Date()
  const pad = value => String(value).padStart(2, '0')
  const ymd = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
  const todayOrders = orders.filter(item => String(item.orderNum || '').startsWith(`ORD${ymd}`))
  return `ORD${ymd}${String(todayOrders.length + 1).padStart(4, '0')}`
}

function appendCartItem(db, goods, count) {
  db.get('cart')
    .push({
      id: goods.id,
      name: goods.name,
      price: goods.price,
      count,
      image: goods.image,
      stock: goods.stock,
      checked: true,
    })
    .write()
}

function createAfterSaleTimeline(order, status, extra = {}) {
  const applyTime = extra.afterSaleApplyTime || order.afterSaleApplyTime || ''
  const handleTime = extra.afterSaleHandleTime || order.afterSaleHandleTime || ''
  const completeTime = extra.afterSaleCompleteTime || order.afterSaleCompleteTime || ''
  const rejectReason = extra.afterSaleRejectReason || order.afterSaleRejectReason || ''

  return [
    {
      key: 'apply',
      title: '提交售后申请',
      description: '申请已创建，等待平台受理。',
      time: applyTime,
      status: ['applying', 'reviewing', 'approved', 'refunding', 'completed', 'rejected'].includes(status) ? 'finished' : 'pending',
    },
    {
      key: 'review',
      title: '平台审核',
      description: status === 'rejected' ? `平台已驳回申请${rejectReason ? `：${rejectReason}` : '。'}` : '平台正在审核申请材料。',
      time: ['reviewing', 'approved', 'refunding', 'completed', 'rejected'].includes(status) ? handleTime || applyTime : '',
      status: status === 'applying' ? 'pending' : status === 'reviewing' ? 'current' : 'finished',
    },
    {
      key: 'result',
      title: status === 'rejected' ? '审核结果' : '审核通过',
      description: status === 'rejected' ? rejectReason || '本次售后申请未通过。' : '审核通过，进入后续处理阶段。',
      time: ['approved', 'refunding', 'completed', 'rejected'].includes(status) ? handleTime : '',
      status: status === 'rejected' ? 'finished' : status === 'approved' ? 'current' : ['refunding', 'completed'].includes(status) ? 'finished' : 'pending',
    },
    {
      key: 'refund',
      title: '退款处理',
      description: '平台将根据审核结果发起退款或补偿。',
      time: ['refunding', 'completed'].includes(status) ? completeTime || handleTime : '',
      status: status === 'refunding' ? 'current' : status === 'completed' ? 'finished' : 'pending',
    },
    {
      key: 'finish',
      title: '售后完成',
      description: status === 'rejected' ? '售后流程已结束。' : '售后流程全部完成。',
      time: ['completed', 'rejected'].includes(status) ? completeTime || handleTime : '',
      status: ['completed', 'rejected'].includes(status) ? 'finished' : 'pending',
    },
  ]
}

function getNextAfterSaleStatus(status) {
  return {
    applying: 'reviewing',
    reviewing: 'approved',
    approved: 'refunding',
    refunding: 'completed',
  }[status] || status
}

function syncGoodsComment(db, order, payload) {
  const goodsList = db.get('goods').value() || []

  for (const item of order.goods || []) {
    const goods = goodsList.find(goodsItem => Number(goodsItem.id) === Number(item.id))
    if (!goods) continue

    const comments = Array.isArray(goods.comments) ? goods.comments.map(normalizeGoodsComment) : []
    const index = comments.findIndex(comment => String(comment.orderId || '') === String(order.id))

    if (payload.mode === 'append') {
      if (index >= 0) {
        comments[index] = {
          ...comments[index],
          appendTime: payload.time.split(' ')[0],
          appendContent: payload.content,
          appendImages: payload.images,
        }
      }
    } else {
      const nextComment = normalizeGoodsComment({
        id: Date.now() + Number(item.id),
        orderId: String(order.id),
        userName: payload.anonymous ? '匿名用户' : 'Wine 用户',
        avatar: 'https://placehold.co/80x80/6B0F1A/FFFFFF.png?text=U',
        score: Number(payload.score),
        content: payload.content,
        time: payload.time.split(' ')[0],
        anonymous: Boolean(payload.anonymous),
        images: payload.images,
      })

      if (index >= 0) {
        comments[index] = nextComment
      } else {
        comments.unshift(nextComment)
      }
    }

    db.get('goods')
      .find({ id: Number(item.id) })
      .assign({
        comments,
        comment: comments.length,
      })
      .write()
  }
}

function isAfterSaleEligible(order) {
  const closeReason = getOrderCloseReason(order)
  return [2, 3, 4].includes(Number(order.status)) || (Number(order.status) === 6 && closeReason === 'commented')
}

function ensureSingleDefaultAddress(db, preferredId) {
  const list = db.get('addresses').value() || []
  if (list.length === 0) return

  const targetId = preferredId || list.find(item => item.isDefault)?.id || list[0].id
  db.set(
    'addresses',
    list.map(item => ({
      ...item,
      isDefault: item.id === targetId,
    }))
  ).write()
}

function normalizeAddressPayload(payload = {}) {
  return {
    name: String(payload.name || '').trim(),
    phone: String(payload.phone || '').trim(),
    province: String(payload.province || '').trim(),
    city: String(payload.city || '').trim(),
    district: String(payload.district || '').trim(),
    detail: String(payload.detail || '').trim(),
    isDefault: Boolean(payload.isDefault),
  }
}

function validateAddressPayload(address) {
  if (!address.name) return '请填写收货人'
  if (!address.phone) return '请填写手机号'
  if (!address.province) return '请填写省份'
  if (!address.city) return '请填写城市'
  if (!address.district) return '请填写区县'
  if (!address.detail) return '请填写详细地址'
  return ''
}

server.get('/goods/:id', (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) {
    res.status(200).jsonp(fail('参数错误'))
    return
  }

  const goods = getDb().get('goods').find({ id }).value()
  if (!goods) {
    res.status(200).jsonp(fail('商品不存在'))
    return
  }

  res.status(200).jsonp(ok(normalizeGoodsDetail(goods)))
})

server.get('/member_coupons', (req, res) => {
  req.url = '/coupons'
  router(req, res)
})

server.get('/member_points_history', (req, res) => {
  req.url = '/point-records'
  router(req, res)
})

server.get('/member_favorites', (req, res) => {
  req.url = '/favorites'
  router(req, res)
})

server.get('/member_footprints', (req, res) => {
  req.url = '/footprints'
  router(req, res)
})

server.get('/member_invoices', (req, res) => {
  req.url = '/invoices'
  router(req, res)
})

server.get('/member_realname', (req, res) => {
  req.url = '/realname'
  router(req, res)
})

server.post('/cart', (req, res) => {
  const id = Number(req.body?.id)
  const count = Number(req.body?.count)
  if (!Number.isFinite(id) || !Number.isFinite(count) || count < 1) {
    res.status(200).jsonp(fail('参数错误'))
    return
  }

  const db = getDb()
  const goods = db.get('goods').find({ id }).value()
  if (!goods) {
    res.status(200).jsonp(fail('商品不存在'))
    return
  }

  const existing = db.get('cart').find({ id }).value()
  if (existing) {
    db.get('cart').find({ id }).assign({ count: existing.count + count, stock: goods.stock, checked: true }).write()
  } else {
    appendCartItem(db, goods, count)
  }

  res.status(200).jsonp(ok(db.get('cart').value(), '加入购物车成功'))
})

server.post('/cart/:id', (req, res) => {
  const id = Number(req.params.id)
  const count = Number(req.body?.count)
  if (!Number.isFinite(id) || !Number.isFinite(count) || count < 1) {
    res.status(200).jsonp(fail('商品数量不能小于 1'))
    return
  }

  const db = getDb()
  const goods = db.get('goods').find({ id }).value()
  const existing = db.get('cart').find({ id }).value()
  if (!existing) {
    res.status(200).jsonp(fail('购物车商品不存在'))
    return
  }

  db.get('cart').find({ id }).assign({ count, stock: goods?.stock ?? existing.stock }).write()
  res.status(200).jsonp(ok(db.get('cart').value(), '数量更新成功'))
})

server.patch('/cart/:id', (req, res) => {
  req.method = 'POST'
  server.handle({ ...req, url: `/cart/${req.params.id}` }, res)
})

server.delete('/cart/:id', (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) {
    res.status(200).jsonp(fail('参数错误'))
    return
  }

  const db = getDb()
  db.get('cart').remove({ id }).write()
  res.status(200).jsonp(ok(db.get('cart').value(), '删除成功'))
})

server.delete('/cart', (req, res) => {
  getDb().set('cart', []).write()
  res.status(200).jsonp(ok(null, '购物车已清空'))
})

server.get('/addresses/default', (req, res) => {
  const address = getDb().get('addresses').find({ isDefault: true }).value() || null
  res.status(200).jsonp(ok(address))
})

server.post('/addresses', (req, res) => {
  const db = getDb()
  const payload = normalizeAddressPayload(req.body)
  const error = validateAddressPayload(payload)
  if (error) {
    res.status(200).jsonp(fail(error))
    return
  }

  const list = db.get('addresses').value() || []
  const nextId = list.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1
  const isDefault = payload.isDefault || list.length === 0

  db.get('addresses').push({ id: nextId, ...payload, isDefault }).write()
  ensureSingleDefaultAddress(db, isDefault ? nextId : undefined)
  res.status(200).jsonp(ok(db.get('addresses').value(), '新增地址成功'))
})

server.post('/addresses/:id', (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) {
    res.status(200).jsonp(fail('参数错误'))
    return
  }

  const db = getDb()
  const existing = db.get('addresses').find({ id }).value()
  if (!existing) {
    res.status(200).jsonp(fail('地址不存在'))
    return
  }

  const payload = normalizeAddressPayload({ ...existing, ...req.body })
  const error = validateAddressPayload(payload)
  if (error) {
    res.status(200).jsonp(fail(error))
    return
  }

  db.get('addresses').find({ id }).assign(payload).write()
  ensureSingleDefaultAddress(db, payload.isDefault ? id : undefined)
  res.status(200).jsonp(ok(db.get('addresses').value(), '编辑地址成功'))
})

server.post('/addresses/:id/default', (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) {
    res.status(200).jsonp(fail('参数错误'))
    return
  }

  const db = getDb()
  const existing = db.get('addresses').find({ id }).value()
  if (!existing) {
    res.status(200).jsonp(fail('地址不存在'))
    return
  }

  ensureSingleDefaultAddress(db, id)
  res.status(200).jsonp(ok(db.get('addresses').value(), '默认地址已更新'))
})

server.delete('/addresses/:id', (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) {
    res.status(200).jsonp(fail('参数错误'))
    return
  }

  const db = getDb()
  db.get('addresses').remove({ id }).write()
  ensureSingleDefaultAddress(db)
  res.status(200).jsonp(ok(db.get('addresses').value(), '删除地址成功'))
})

server.post('/orders/submit', (req, res) => {
  const db = getDb()
  const { goods = [], address, remark = '', from = 'buyNow' } = req.body || {}

  if (!Array.isArray(goods) || goods.length === 0) {
    res.status(200).jsonp(fail('暂无可提交商品'))
    return
  }

  if (!address || !address.id) {
    res.status(200).jsonp(fail('请选择收货地址'))
    return
  }

  const sourceGoods = db.get('goods').value() || []
  for (const item of goods) {
    const source = sourceGoods.find(goodsItem => Number(goodsItem.id) === Number(item.id))
    if (!source) {
      res.status(200).jsonp(fail(`${item.name || '商品'}不存在`))
      return
    }

    if (Number(item.count || 0) > Number(source.stock || 0)) {
      res.status(200).jsonp(fail(`${item.name || source.name}库存不足`))
      return
    }
  }

  const totalPrice = goods.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.count || 0), 0)
  const totalCount = goods.reduce((sum, item) => sum + Number(item.count || 0), 0)
  const freight = 0
  const payPrice = totalPrice + freight

  const order = normalizeOrder({
    id: String(Date.now()),
    orderNum: generateOrderNum(db),
    createTime: formatDateTime(),
    totalPrice,
    totalCount,
    freight,
    payPrice,
    goods: goods.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      count: item.count,
      image: item.image,
      spec: item.spec || '',
      stock: item.stock,
    })),
    address,
    remark,
    payType: '',
    ...createOrderStatePatch(1),
  })

  db.get('orders').unshift(order).write()
  db.set('order_confirm_list', []).write()

  if (from === 'cart') {
    const ids = goods.map(item => Number(item.id))
    db.get('cart').remove(item => ids.includes(Number(item.id))).write()
  }

  res.status(200).jsonp(ok(order, '订单提交成功'))
})

server.post('/orders/:id/cancel', (req, res) => {
  const id = String(req.params.id)
  const db = getDb()
  const order = db.get('orders').find({ id }).value()
  if (!order) {
    res.status(200).jsonp(fail('订单不存在'))
    return
  }

  if (Number(order.status) !== 1) {
    res.status(200).jsonp(fail('当前订单不可取消'))
    return
  }

  const cancelTime = formatDateTime()
  const nextOrder = normalizeOrder({
    ...order,
    ...createOrderStatePatch(6, {
      payTime: order.payTime || '',
      deliveryTime: order.deliveryTime || '',
      finishTime: order.finishTime || '',
      cancelTime,
      closeReason: 'cancelled',
      logisticsCompany: order.logisticsCompany || '',
      logisticsNo: order.logisticsNo || '',
      logisticsStatusText: order.logisticsStatusText || '暂无物流信息',
    }),
  })

  db.get('orders').find({ id }).assign(nextOrder).write()
  res.status(200).jsonp(ok({
    id,
    status: 6,
    statusLabel: '已关闭',
    cancelTime,
    closeReason: 'cancelled',
  }, '订单已关闭'))
})

server.post('/orders/:id/confirm', (req, res) => {
  const id = String(req.params.id)
  const db = getDb()
  const order = db.get('orders').find({ id }).value()
  if (!order) {
    res.status(200).jsonp(fail('订单不存在'))
    return
  }

  if (Number(order.status) !== 3) {
    res.status(200).jsonp(fail('当前订单不可确认收货'))
    return
  }

  const finishTime = formatDateTime()
  const nextOrder = normalizeOrder({
    ...order,
    ...createOrderStatePatch(4, {
      payTime: order.payTime || '',
      deliveryTime: order.deliveryTime || '',
      finishTime,
      logisticsCompany: order.logisticsCompany || '',
      logisticsNo: order.logisticsNo || '',
      logisticsStatusText: order.logisticsStatusText || '暂无物流信息',
    }),
  })

  db.get('orders').find({ id }).assign(nextOrder).write()
  res.status(200).jsonp(ok({
    id,
    status: 4,
    statusLabel: '待评价',
    finishTime,
  }, '已确认收货'))
})

server.delete('/orders/:id', (req, res) => {
  const id = String(req.params.id)
  const db = getDb()
  const order = db.get('orders').find({ id }).value()
  if (!order) {
    res.status(200).jsonp(fail('订单不存在'))
    return
  }

  if (Number(order.status) !== 6 || ['applying', 'reviewing', 'approved', 'refunding'].includes(order.afterSaleStatus)) {
    res.status(200).jsonp(fail('当前订单不可删除'))
    return
  }

  db.get('orders').remove({ id }).write()
  res.status(200).jsonp(ok(null, '订单已删除'))
})

server.post('/orders/:id/rebuy', (req, res) => {
  const id = String(req.params.id)
  const db = getDb()
  const order = db.get('orders').find({ id }).value()
  if (!order) {
    res.status(200).jsonp(fail('订单不存在'))
    return
  }

  const goodsList = db.get('goods').value() || []
  const affectedIds = []

  for (const item of order.goods || []) {
    const goods = goodsList.find(goodsItem => Number(goodsItem.id) === Number(item.id))
    if (!goods) {
      res.status(200).jsonp(fail(`${item.name || '商品'}不存在`))
      return
    }

    if (Number(item.count || 0) > Number(goods.stock || 0)) {
      res.status(200).jsonp(fail(`${goods.name}库存不足`))
      return
    }
  }

  for (const item of order.goods || []) {
    const goods = goodsList.find(goodsItem => Number(goodsItem.id) === Number(item.id))
    const existing = db.get('cart').find({ id: Number(item.id) }).value()
    if (existing) {
      db.get('cart')
        .find({ id: Number(item.id) })
        .assign({
          count: Number(item.count || 0),
          stock: Number(goods.stock || 0),
          checked: true,
        })
        .write()
    } else {
      appendCartItem(db, goods, Number(item.count || 0))
    }
    affectedIds.push(Number(item.id))
  }

  res.status(200).jsonp(ok({ id, affectedIds }, '已同步到购物车'))
})

server.post('/orders/:id/comment', (req, res) => {
  const id = String(req.params.id)
  const { score = 0, content = '', anonymous = false, images = [], mode = 'initial' } = req.body || {}
  const db = getDb()
  const order = db.get('orders').find({ id }).value()
  if (!order) {
    res.status(200).jsonp(fail('订单不存在'))
    return
  }

  const commentTime = formatDateTime()
  const commentContent = String(content || '').trim()
  const commentImages = Array.isArray(images) ? images.slice(0, 3) : []

  if (mode === 'append') {
    if (Number(order.status) !== 6 || getOrderCloseReason(order) !== 'commented') {
      res.status(200).jsonp(fail('当前订单不可追评'))
      return
    }

    if (order.appendCommentTime) {
      res.status(200).jsonp(fail('该订单已完成追评'))
      return
    }

    syncGoodsComment(db, order, {
      mode: 'append',
      content: commentContent,
      images: commentImages,
      time: commentTime,
      score: Number(order.commentScore || score || 0),
      anonymous: Boolean(order.commentAnonymous),
    })

    db.get('orders').find({ id }).assign({
      appendCommentTime: commentTime,
      appendCommentContent: commentContent,
      appendCommentImages: commentImages,
    }).write()

    res.status(200).jsonp(ok({
      id,
      status: 6,
      statusLabel: '已关闭',
      closeReason: 'commented',
      appendCommentTime: commentTime,
      appendCommentContent: commentContent,
      appendCommentImages: commentImages,
    }, '追评提交成功'))
    return
  }

  if (Number(order.status) !== 4) {
    res.status(200).jsonp(fail('当前订单不可评价'))
    return
  }

  syncGoodsComment(db, order, {
    mode: 'initial',
    content: commentContent,
    images: commentImages,
    time: commentTime,
    score: Number(score),
    anonymous: Boolean(anonymous),
  })

  const nextOrder = normalizeOrder({
    ...order,
    ...createOrderStatePatch(6, {
      payTime: order.payTime || '',
      deliveryTime: order.deliveryTime || '',
      finishTime: order.finishTime || '',
      cancelTime: order.cancelTime || '',
      closeReason: 'commented',
      commentTime,
      commentScore: Number(score),
      commentContent,
      commentAnonymous: Boolean(anonymous),
      commentImages,
      logisticsCompany: order.logisticsCompany || '',
      logisticsNo: order.logisticsNo || '',
      logisticsStatusText: order.logisticsStatusText || '暂无物流信息',
    }),
  })

  db.get('orders').find({ id }).assign(nextOrder).write()
  res.status(200).jsonp(ok({
    id,
    status: 6,
    statusLabel: '已关闭',
    closeReason: 'commented',
    commentTime,
    commentScore: Number(score),
    commentContent,
    commentAnonymous: Boolean(anonymous),
    commentImages,
  }, '评价提交成功'))
})

server.post('/orders/:id/after-sale', (req, res) => {
  const id = String(req.params.id)
  const { type = '', reason = '' } = req.body || {}
  const db = getDb()
  const order = db.get('orders').find({ id }).value()
  if (!order) {
    res.status(200).jsonp(fail('订单不存在'))
    return
  }

  if (!isAfterSaleEligible(order)) {
    res.status(200).jsonp(fail('当前订单不可申请售后'))
    return
  }

  if (order.afterSaleStatus && order.afterSaleStatus !== 'none') {
    res.status(200).jsonp(fail('售后申请已存在'))
    return
  }

  const afterSaleApplyTime = formatDateTime()
  const nextPatch = {
    afterSaleStatus: 'applying',
    afterSaleType: String(type || '').trim(),
    afterSaleReason: String(reason || '').trim(),
    afterSaleApplyTime,
    afterSaleHandleTime: '',
    afterSaleCompleteTime: '',
    afterSaleRejectReason: '',
  }
  const nextTimeline = createAfterSaleTimeline(order, nextPatch.afterSaleStatus, nextPatch)

  db.get('orders').find({ id }).assign({
    ...nextPatch,
    afterSaleTimeline: nextTimeline,
  }).write()

  res.status(200).jsonp(ok({
    id,
    status: Number(order.status),
    statusLabel: getOrderStatusLabel(order.status),
    closeReason: getOrderCloseReason(order),
    ...nextPatch,
    afterSaleTimeline: nextTimeline,
  }, '售后申请已提交'))
})

server.post('/orders/:id/after-sale/advance', (req, res) => {
  const id = String(req.params.id)
  const db = getDb()
  const order = db.get('orders').find({ id }).value()
  if (!order) {
    res.status(200).jsonp(fail('订单不存在'))
    return
  }

  if (!order.afterSaleStatus || order.afterSaleStatus === 'none') {
    res.status(200).jsonp(fail('当前订单暂无售后流程'))
    return
  }

  const nextStatus = getNextAfterSaleStatus(order.afterSaleStatus)
  if (nextStatus === order.afterSaleStatus) {
    res.status(200).jsonp(fail('当前售后状态不可继续推进'))
    return
  }

  const now = formatDateTime()
  const nextPatch = {
    afterSaleStatus: nextStatus,
    afterSaleHandleTime: ['reviewing', 'approved'].includes(nextStatus) ? now : order.afterSaleHandleTime || now,
    afterSaleCompleteTime: ['refunding', 'completed'].includes(nextStatus) ? now : order.afterSaleCompleteTime || '',
    afterSaleRejectReason: order.afterSaleRejectReason || '',
  }
  const nextTimeline = createAfterSaleTimeline(order, nextStatus, { ...order, ...nextPatch })

  db.get('orders').find({ id }).assign({
    ...nextPatch,
    afterSaleTimeline: nextTimeline,
  }).write()

  res.status(200).jsonp(ok({
    id,
    status: Number(order.status),
    statusLabel: getOrderStatusLabel(order.status),
    closeReason: getOrderCloseReason(order),
    afterSaleType: order.afterSaleType || '',
    afterSaleReason: order.afterSaleReason || '',
    afterSaleApplyTime: order.afterSaleApplyTime || '',
    ...nextPatch,
    afterSaleTimeline: nextTimeline,
  }, '售后进度已更新'))
})

server.get('/order/:id/detail', (req, res) => {
  const id = String(req.params.id)
  const order = getDb().get('orders').find({ id }).value()
  if (!order) {
    res.status(200).jsonp(fail('订单不存在'))
    return
  }

  res.status(200).jsonp(ok({
    order: normalizeOrder(order),
  }))
})

server.post('/order/pay', (req, res) => {
  const id = String(req.body?.id || '')
  const payType = String(req.body?.payType || 'wechat')
  if (!id) {
    res.status(200).jsonp(fail('参数错误'))
    return
  }

  const db = getDb()
  const order = db.get('orders').find({ id }).value()
  if (!order) {
    res.status(200).jsonp(fail('订单不存在'))
    return
  }

  if (Number(order.status) !== 1) {
    res.status(200).jsonp(fail('订单不可支付'))
    return
  }

  const payTime = formatDateTime()
  const nextOrder = normalizeOrder({
    ...order,
    ...createOrderStatePatch(2, {
      payTime,
      logisticsStatusText: '商家已收款，待安排发货',
    }),
    payType,
  })

  db.get('orders').find({ id }).assign(nextOrder).write()
  res.status(200).jsonp(ok({
    id,
    status: 2,
    statusLabel: '待发货',
    payTime,
  }, '支付成功'))
})

server.use(router)

server.use((req, res) => {
  res.status(200).jsonp(fail('接口不存在'))
})

function start(port = PORT) {
  const instance = server.listen(port, () => {
    const actualPort = instance.address()?.port ?? port
    console.log(`Mock server running at http://127.0.0.1:${actualPort}`)
  })
  return instance
}

module.exports = { server, start }

if (require.main === module) {
  start(PORT)
}
