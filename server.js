const jsonServer = require('json-server')
const path = require('path')

const PORT = Number(process.env.PORT || 3000)
const DB_PATH = path.join(__dirname, 'db.json')

function ok(data, message = 'ok') {
  return { code: 0, message, data }
}

function fail(message, data = null) {
  return { code: 1, message, data }
}

const server = jsonServer.create()
const router = jsonServer.router(DB_PATH)
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

router.render = (req, res) => {
  const statusCode = res.statusCode
  if (statusCode >= 400) {
    const message = statusCode === 404 ? '资源不存在' : '请求失败'
    res.status(200).jsonp(fail(message))
    return
  }
  res.status(200).jsonp(ok(res.locals.data))
}

function buildGoodsDetail(goods) {
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
      ].filter((p) => p.value)

  const detail = Array.isArray(goods.detail)
    ? goods.detail
    : [
        { type: 'title', value: '酒品介绍' },
        { type: 'text', value: goods.description || '' },
        { type: 'image', value: goods.image || '' },
      ].filter((b) => b.value)

  let comments = Array.isArray(goods.comments) ? goods.comments : []
  if (comments.length === 0 && Number(goods.comment || 0) > 0) {
    const count = Math.min(2, Number(goods.comment || 0))
    comments = Array.from({ length: count }).map((_, idx) => ({
      id: goods.id * 10 + idx + 1,
      userName: idx === 0 ? '酒友A' : '酒友B',
      avatar: 'https://placehold.co/80x80/6B0F1A/FFFFFF.png?text=U',
      score: 5,
      content:
        idx === 0
          ? '口感非常平衡，果香浓郁，回味悠长。'
          : '包装精美，适合送礼，物流也很快。',
      time: '2026-03-20',
      images: [],
    }))
  }

  return {
    ...goods,
    stock,
    params,
    detail,
    comments,
  }
}

server.get('/goods/:id', (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) {
    res.status(200).jsonp(fail('参数错误'))
    return
  }

  const db = router.db
  const goods = db.get('goods').find({ id }).value()
  if (!goods) {
    res.status(200).jsonp(fail('商品不存在'))
    return
  }

  res.status(200).jsonp(ok(buildGoodsDetail(goods)))
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

function handleAddToCart(req, res) {
  const { id, count } = req.body || {}
  const goodsId = Number(id)
  const addCount = Number(count)

  if (!Number.isFinite(goodsId) || !Number.isFinite(addCount) || addCount < 1) {
    res.status(200).jsonp(fail('参数错误'))
    return
  }

  const db = router.db
  const goods = db.get('goods').find({ id: goodsId }).value()

  if (!goods) {
    res.status(200).jsonp(fail('商品不存在'))
    return
  }

  const existing = db.get('cart').find({ id: goodsId }).value()
  if (existing) {
    db.get('cart').find({ id: goodsId }).assign({ count: existing.count + addCount, stock: goods.stock, checked: true }).write()
  } else {
    appendCartItem(db, goods, addCount)
  }

  res.status(200).jsonp(ok(db.get('cart').value(), '加入购物车成功'))
}

function handleUpdateCartCount(req, res, cartId, nextCount) {
  if (!Number.isFinite(cartId) || !Number.isFinite(nextCount) || nextCount < 1) {
    res.status(200).jsonp(fail('商品数量不能小于 1'))
    return
  }

  const db = router.db

  const goods = db.get('goods').find({ id: cartId }).value()

  const existing = db.get('cart').find({ id: cartId }).value()
  if (!existing) {
    res.status(200).jsonp(fail('购物车商品不存在'))
    return
  }

  db.get('cart').find({ id: cartId }).assign({ count: nextCount, stock: goods?.stock ?? existing.stock, }).write()
  res.status(200).jsonp(ok(db.get('cart').value(), '数量更新成功'))
}

function handleDeleteCartItem(req, res, cartId) {
  if (!Number.isFinite(cartId)) {
    res.status(200).jsonp(fail('参数错误'))
    return
  }

  const db = router.db
  db.get('cart').remove({ id: cartId }).write()
  res.status(200).jsonp(ok(db.get('cart').value(), '删除成功'))
}

server.post('/cart', handleAddToCart)

server.post('/cart/:id', (req, res) => {
  const cartId = Number(req.params.id)
  const { count } = req.body || {}
  const nextCount = Number(count)
  handleUpdateCartCount(req, res, cartId, nextCount)
})

server.patch('/cart/:id', (req, res) => {
  const cartId = Number(req.params.id)
  const { count } = req.body || {}
  const nextCount = Number(count)
  handleUpdateCartCount(req, res, cartId, nextCount)
})

server.delete('/cart/:id', (req, res) => {
  const cartId = Number(req.params.id)
  handleDeleteCartItem(req, res, cartId)
})

server.delete('/cart', (req, res) => {
  const db = router.db
  db.set('cart', []).write()
  res.status(200).jsonp(ok(null, '购物车已清空'))
})

server.get('/addresses/default', (req, res) => {
  const db = router.db
  const address = db.get('addresses').find({ isDefault: true }).value() || null
  res.status(200).jsonp(ok(address))
})

function normalizeAddressPayload(payload) {
  const data = payload || {}
  return {
    name: typeof data.name === 'string' ? data.name.trim() : '',
    phone: typeof data.phone === 'string' ? data.phone.trim() : '',
    province: typeof data.province === 'string' ? data.province.trim() : '',
    city: typeof data.city === 'string' ? data.city.trim() : '',
    district: typeof data.district === 'string' ? data.district.trim() : '',
    detail: typeof data.detail === 'string' ? data.detail.trim() : '',
    isDefault: Boolean(data.isDefault),
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

function ensureSingleDefault(db, preferredId) {
  const list = db.get('addresses').value() || []
  if (list.length === 0) return

  const targetId =
    preferredId ??
    (list.find(item => item.isDefault)?.id ?? list[0].id)

  db.set(
    'addresses',
    list.map(item => ({
      ...item,
      isDefault: item.id === targetId,
    }))
  ).write()
}

server.post('/addresses', (req, res) => {
  const db = router.db
  const payload = normalizeAddressPayload(req.body)
  const error = validateAddressPayload(payload)
  if (error) {
    res.status(200).jsonp(fail(error))
    return
  }

  const list = db.get('addresses').value() || []
  const maxId = list.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0)
  const nextId = maxId + 1

  const shouldBeDefault = payload.isDefault || list.length === 0
  payload.isDefault = shouldBeDefault

  db.get('addresses')
    .push({ id: nextId, ...payload, isDefault: shouldBeDefault })
    .write()

  if (shouldBeDefault) {
    ensureSingleDefault(db, nextId)
  } else {
    ensureSingleDefault(db)
  }

  res.status(200).jsonp(ok(db.get('addresses').value(), '新增地址成功'))
})

server.post('/addresses/:id', (req, res) => {
  const addressId = Number(req.params.id)
  if (!Number.isFinite(addressId)) {
    res.status(200).jsonp(fail('参数错误'))
    return
  }

  const db = router.db
  const existing = db.get('addresses').find({ id: addressId }).value()
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

  db.get('addresses')
    .find({ id: addressId })
    .assign(payload)
    .write()

  if (payload.isDefault) {
    ensureSingleDefault(db, addressId)
  } else {
    ensureSingleDefault(db)
  }

  res.status(200).jsonp(ok(db.get('addresses').value(), '编辑地址成功'))
})

server.post('/addresses/:id/default', (req, res) => {
  const addressId = Number(req.params.id)
  if (!Number.isFinite(addressId)) {
    res.status(200).jsonp(fail('参数错误'))
    return
  }

  const db = router.db
  const existing = db.get('addresses').find({ id: addressId }).value()
  if (!existing) {
    res.status(200).jsonp(fail('地址不存在'))
    return
  }

  ensureSingleDefault(db, addressId)
  res.status(200).jsonp(ok(db.get('addresses').value(), '默认地址已更新'))
})

server.delete('/addresses/:id', (req, res) => {
  const addressId = Number(req.params.id)
  if (!Number.isFinite(addressId)) {
    res.status(200).jsonp(fail('参数错误'))
    return
  }

  const db = router.db
  db.get('addresses').remove({ id: addressId }).write()
  ensureSingleDefault(db)

  res.status(200).jsonp(ok(db.get('addresses').value(), '删除地址成功'))
})

function formatDateTime(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  const h = pad(date.getHours())
  const min = pad(date.getMinutes())
  return `${y}-${m}-${d} ${h}:${min}`
}

function generateOrderNum(db) {
  const list = db.get('orders').value() || []
  const date = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const ymd = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
  const todayOrders = list.filter(item => String(item.orderNum || '').startsWith(`ORD${ymd}`))
  const seq = String(todayOrders.length + 1).padStart(4, '0')
  return `ORD${ymd}${seq}`
}

function getOrderCloseReason(order) {
  if (order.closeReason) return order.closeReason
  if (Number(order.status) !== 6) return ''
  return order.commentTime ? 'commented' : 'cancelled'
}

function isAfterSaleEligible(order) {
  const closeReason = getOrderCloseReason(order)
  return [2, 3, 4].includes(Number(order.status)) || (Number(order.status) === 6 && closeReason === 'commented')
}

function createOrderStatePatch(status, extra = {}) {
  return {
    status,
    statusLabel: {
      1: '待付款',
      2: '待发货',
      3: '待收货',
      4: '待评价',
      6: '已关闭',
    }[status] || '',
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

function createAfterSaleTimeline(order, status, extra = {}) {
  const timeline = []
  const applyTime = extra.afterSaleApplyTime || order.afterSaleApplyTime || ''
  const handleTime = extra.afterSaleHandleTime || order.afterSaleHandleTime || ''
  const completeTime = extra.afterSaleCompleteTime || order.afterSaleCompleteTime || ''
  const rejectReason = extra.afterSaleRejectReason || order.afterSaleRejectReason || ''

  timeline.push({
    key: 'apply',
    title: '提交售后申请',
    description: '申请已创建，等待平台受理。',
    time: applyTime,
    status: ['applying', 'reviewing', 'approved', 'refunding', 'completed', 'rejected'].includes(status) ? 'finished' : 'pending',
  })

  timeline.push({
    key: 'review',
    title: '平台审核',
    description: status === 'rejected' ? `平台已驳回申请${rejectReason ? `：${rejectReason}` : '。'}` : '平台正在审核申请材料。',
    time: ['reviewing', 'approved', 'refunding', 'completed', 'rejected'].includes(status) ? handleTime || applyTime : '',
    status: status === 'applying' ? 'pending' : status === 'reviewing' ? 'current' : 'finished',
  })

  timeline.push({
    key: 'result',
    title: status === 'rejected' ? '审核结果' : '审核通过',
    description:
      status === 'rejected'
        ? rejectReason || '本次售后申请未通过。'
        : '审核通过，进入后续处理阶段。',
    time: ['approved', 'refunding', 'completed', 'rejected'].includes(status) ? handleTime : '',
    status:
      status === 'rejected'
        ? 'finished'
        : status === 'approved'
          ? 'current'
          : ['refunding', 'completed'].includes(status)
            ? 'finished'
            : 'pending',
  })

  timeline.push({
    key: 'refund',
    title: '退款处理',
    description: '退款或补偿处理中，请耐心等待。',
    time: ['refunding', 'completed'].includes(status) ? completeTime || handleTime : '',
    status: status === 'refunding' ? 'current' : status === 'completed' ? 'finished' : 'pending',
  })

  timeline.push({
    key: 'finish',
    title: '售后完成',
    description: status === 'rejected' ? '售后流程已结束。' : '售后流程已完成。',
    time: status === 'completed' || status === 'rejected' ? completeTime || handleTime : '',
    status: status === 'completed' || status === 'rejected' ? 'finished' : 'pending',
  })

  return timeline
}

function getNextAfterSaleStatus(status) {
  const flow = {
    applying: 'reviewing',
    reviewing: 'approved',
    approved: 'refunding',
    refunding: 'completed',
  }

  return flow[status] || status
}

function syncGoodsComment(db, order, payload) {
  const goodsList = db.get('goods').value() || []

  for (const item of order.goods || []) {
    const goods = goodsList.find(g => Number(g.id) === Number(item.id))
    if (!goods) continue

    const comments = Array.isArray(goods.comments) ? [...goods.comments] : []
    const commentIndex = comments.findIndex(comment => String(comment.orderId || '') === String(order.id))

    if (payload.mode === 'append') {
      if (commentIndex >= 0) {
        comments[commentIndex] = {
          ...comments[commentIndex],
          appendTime: payload.time.split(' ')[0],
          appendContent: payload.content,
          appendImages: payload.images,
        }
      }
    } else {
      const nextComment = {
        id: Date.now() + Number(item.id),
        orderId: String(order.id),
        userName: payload.anonymous ? '????' : 'Wine ??',
        avatar: 'https://placehold.co/80x80/6B0F1A/FFFFFF.png?text=U',
        score: Number(payload.score),
        content: payload.content,
        time: payload.time.split(' ')[0],
        images: payload.images,
        anonymous: Boolean(payload.anonymous),
        appendTime: '',
        appendContent: '',
        appendImages: [],
      }

      if (commentIndex >= 0) {
        comments[commentIndex] = nextComment
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

server.post('/orders/submit', (req, res) => {
  const db = router.db
  const { goods, address, remark = '', from = 'buyNow' } = req.body || {}

  if (!Array.isArray(goods) || goods.length === 0) {
    res.status(200).jsonp(fail('暂无可提交商品'))
    return
  }

  if (!address || !address.id) {
    res.status(200).jsonp(fail('请选择收货地址'))
    return
  }

  const goodsSource = db.get('goods').value() || []
  for (const item of goods) {
    const source = goodsSource.find(g => Number(g.id) === Number(item.id))
    if (!source) {
      res.status(200).jsonp(fail(`${item.name || '商品'} 不存在`))
      return
    }

    if (Number(item.count || 0) > Number(source.stock || 0)) {
      res.status(200).jsonp(fail(`${item.name || source.name} 库存不足`))
      return
    }
  }

  const totalPrice = goods.reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.count || 0)
  }, 0)

  const totalCount = goods.reduce((sum, item) => {
    return sum + Number(item.count || 0)
  }, 0)

  const freight = 0
  const payPrice = totalPrice + freight

  const order = {
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
  }

  db.get('orders').unshift(order).write()
  db.set('order_confirm_list', []).write()

  if (from === 'cart') {
    const checkedIds = goods.map(item => item.id)
    db.get('cart').remove(item => checkedIds.includes(item.id)).write()
  }

  res.status(200).jsonp(ok(order, '订单提交成功'))
})

server.post('/orders/:id/cancel', (req, res) => {
  const orderId = String(req.params.id)
  const db = router.db
  const order = db.get('orders').find({ id: orderId }).value()

  if (!order) {
    res.status(200).jsonp(fail('订单不存在'))
    return
  }

  if (order.status !== 1) {
    res.status(200).jsonp(fail('当前订单不可取消'))
    return
  }

  const cancelTime = formatDateTime()

  db.get('orders')
    .find({ id: orderId })
    .assign({
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
    .write()

  res.status(200).jsonp(ok({
    id: orderId,
    status: 6,
    statusLabel: '已关闭',
    cancelTime,
    closeReason: 'cancelled',
  }, '订单已关闭'))
})

server.post('/orders/:id/confirm', (req, res) => {
  const orderId = String(req.params.id)
  const db = router.db
  const order = db.get('orders').find({ id: orderId }).value()

  if (!order) {
    res.status(200).jsonp(fail('订单不存在'))
    return
  }

  if (order.status !== 3) {
    res.status(200).jsonp(fail('当前订单不可确认收货'))
    return
  }

  const finishTime = formatDateTime()

  db.get('orders')
    .find({ id: orderId })
    .assign({
      ...createOrderStatePatch(4, {
        payTime: order.payTime || '',
        deliveryTime: order.deliveryTime || '',
        finishTime,
        logisticsCompany: order.logisticsCompany || '',
        logisticsNo: order.logisticsNo || '',
        logisticsStatusText: order.logisticsStatusText || '暂无物流信息',
      }),
    })
    .write()

  res.status(200).jsonp(ok({
    id: orderId,
    status: 4,
    statusLabel: '待评价',
    finishTime,
  }, '已确认收货'))
})

server.delete('/orders/:id', (req, res) => {
  const orderId = String(req.params.id)
  const db = router.db
  const order = db.get('orders').find({ id: orderId }).value()

  if (!order) {
    res.status(200).jsonp(fail('订单不存在'))
    return
  }

  if (Number(order.status) !== 6 || order.afterSaleStatus === 'applying') {
    res.status(200).jsonp(fail('当前订单不可删除'))
    return
  }

  db.get('orders').remove({ id: orderId }).write()
  res.status(200).jsonp(ok(null, '订单已删除'))
})

server.post('/orders/:id/rebuy', (req, res) => {
  const orderId = String(req.params.id)
  const db = router.db
  const order = db.get('orders').find({ id: orderId }).value()

  if (!order) {
    res.status(200).jsonp(fail('订单不存在'))
    return
  }

  const goodsSource = db.get('goods').value() || []
  const affectedIds = []

  for (const item of order.goods || []) {
    const goods = goodsSource.find(g => Number(g.id) === Number(item.id))
    if (!goods) {
      res.status(200).jsonp(fail(`${item.name || '商品'} 不存在`))
      return
    }

    const nextCount = Number(item.count || 0)
    if (nextCount > Number(goods.stock || 0)) {
      res.status(200).jsonp(fail(`${goods.name} 库存不足`))
      return
    }
  }

  for (const item of order.goods || []) {
    const goods = goodsSource.find(g => Number(g.id) === Number(item.id))
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

  res.status(200).jsonp(ok({
    id: orderId,
    affectedIds,
  }, '已同步到购物车'))
})

server.post('/orders/:id/comment', (req, res) => {
  const orderId = String(req.params.id)
  const { score = 0, content = '', anonymous = false, images = [], mode = 'initial' } = req.body || {}
  const db = router.db
  const order = db.get('orders').find({ id: orderId }).value()

  if (!order) {
    res.status(200).jsonp(fail('订单不存在'))
    return
  }

  const commentContent = String(content).trim()
  const commentImages = Array.isArray(images) ? images.slice(0, 3) : []
  const commentTime = formatDateTime()

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

    db.get('orders')
      .find({ id: orderId })
      .assign({
        appendCommentTime: commentTime,
        appendCommentContent: commentContent,
        appendCommentImages: commentImages,
      })
      .write()

    res.status(200).jsonp(ok({
      id: orderId,
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

  db.get('orders')
    .find({ id: orderId })
    .assign({
      ...createOrderStatePatch(6, {
        payTime: order.payTime || '',
        deliveryTime: order.deliveryTime || '',
        finishTime: order.finishTime || '',
        cancelTime: order.cancelTime || '',
        closeReason: 'commented',
        commentTime,
        commentScore: Number(score),
        commentContent: commentContent,
        commentAnonymous: Boolean(anonymous),
        commentImages,
        logisticsCompany: order.logisticsCompany || '',
        logisticsNo: order.logisticsNo || '',
        logisticsStatusText: order.logisticsStatusText || '暂无物流信息',
      }),
    })
    .write()

  res.status(200).jsonp(ok({
    id: orderId,
    status: 6,
    statusLabel: '已关闭',
    closeReason: 'commented',
    commentTime,
    commentScore: Number(score),
    commentContent: commentContent,
    commentAnonymous: Boolean(anonymous),
    commentImages,
  }, '评价提交成功'))
})

server.post('/orders/:id/comment-legacy', (req, res) => {
  const orderId = String(req.params.id)
  const { score = 0, content = '' } = req.body || {}
  const db = router.db
  const order = db.get('orders').find({ id: orderId }).value()

  if (!order) {
    res.status(200).jsonp(fail('订单不存在'))
    return
  }

  if (Number(order.status) !== 4) {
    res.status(200).jsonp(fail('当前订单不可评价'))
    return
  }

  const commentTime = formatDateTime()
  const goodsList = db.get('goods').value() || []

  for (const item of order.goods || []) {
    const goods = goodsList.find(g => Number(g.id) === Number(item.id))
    if (!goods) continue

    const nextComments = Array.isArray(goods.comments) ? [...goods.comments] : []
    nextComments.unshift({
      id: Date.now() + Number(item.id),
      userName: 'Wine 用户',
      avatar: 'https://placehold.co/80x80/6B0F1A/FFFFFF.png?text=U',
      score: Number(score),
      content: String(content).trim(),
      time: commentTime.split(' ')[0],
      images: [],
    })

    db.get('goods')
      .find({ id: Number(item.id) })
      .assign({
        comments: nextComments,
        comment: nextComments.length,
      })
      .write()
  }

  db.get('orders')
    .find({ id: orderId })
    .assign({
      ...createOrderStatePatch(6, {
        payTime: order.payTime || '',
        deliveryTime: order.deliveryTime || '',
        finishTime: order.finishTime || '',
        cancelTime: order.cancelTime || '',
        closeReason: 'commented',
        commentTime,
        commentScore: Number(score),
        commentContent: String(content).trim(),
        logisticsCompany: order.logisticsCompany || '',
        logisticsNo: order.logisticsNo || '',
        logisticsStatusText: order.logisticsStatusText || '暂无物流信息',
      }),
    })
    .write()

  res.status(200).jsonp(ok({
    id: orderId,
    status: 6,
    statusLabel: '已关闭',
    closeReason: 'commented',
    commentTime,
    commentScore: Number(score),
    commentContent: String(content).trim(),
  }, '评价提交成功'))
})

server.post('/orders/:id/after-sale', (req, res) => {
  const orderId = String(req.params.id)
  const { type = '', reason = '' } = req.body || {}
  const db = router.db
  const order = db.get('orders').find({ id: orderId }).value()

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
  const nextStatus = 'applying'
  const nextPatch = {
    afterSaleStatus: nextStatus,
    afterSaleType: String(type).trim(),
    afterSaleReason: String(reason).trim(),
    afterSaleApplyTime,
    afterSaleHandleTime: '',
    afterSaleCompleteTime: '',
    afterSaleRejectReason: '',
  }

  db.get('orders')
    .find({ id: orderId })
    .assign({
      ...nextPatch,
      afterSaleTimeline: createAfterSaleTimeline(order, nextStatus, nextPatch),
    })
    .write()

  res.status(200).jsonp(ok({
    id: orderId,
    status: Number(order.status),
    statusLabel: Number(order.status) === 6 ? '已关闭' : order.statusLabel,
    closeReason: getOrderCloseReason(order),
    ...nextPatch,
    afterSaleTimeline: createAfterSaleTimeline(order, nextStatus, nextPatch),
  }, '售后申请已提交'))
})

server.post('/orders/:id/after-sale/advance', (req, res) => {
  const orderId = String(req.params.id)
  const db = router.db
  const order = db.get('orders').find({ id: orderId }).value()

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

  const nextTimeline = createAfterSaleTimeline(order, nextStatus, {
    ...order,
    ...nextPatch,
  })

  db.get('orders')
    .find({ id: orderId })
    .assign({
      ...nextPatch,
      afterSaleTimeline: nextTimeline,
    })
    .write()

  res.status(200).jsonp(ok({
    id: orderId,
    status: Number(order.status),
    statusLabel: Number(order.status) === 6 ? '已关闭' : order.statusLabel,
    closeReason: getOrderCloseReason(order),
    ...nextPatch,
    afterSaleType: order.afterSaleType || '',
    afterSaleReason: order.afterSaleReason || '',
    afterSaleApplyTime: order.afterSaleApplyTime || '',
    afterSaleTimeline: nextTimeline,
  }, '售后进度已更新'))
})

server.post('/orders/:id/after-sale-legacy', (req, res) => {
  const orderId = String(req.params.id)
  const { type = '', reason = '' } = req.body || {}
  const db = router.db
  const order = db.get('orders').find({ id: orderId }).value()

  if (!order) {
    res.status(200).jsonp(fail('订单不存在'))
    return
  }

  if (!isAfterSaleEligible(order)) {
    res.status(200).jsonp(fail('当前订单不可申请售后'))
    return
  }

  if (order.afterSaleStatus === 'applying') {
    res.status(200).jsonp(fail('售后申请已提交'))
    return
  }

  const afterSaleApplyTime = formatDateTime()

  db.get('orders')
    .find({ id: orderId })
    .assign({
      afterSaleStatus: 'applying',
      afterSaleType: String(type).trim(),
      afterSaleReason: String(reason).trim(),
      afterSaleApplyTime,
    })
    .write()

  res.status(200).jsonp(ok({
    id: orderId,
    status: Number(order.status),
    statusLabel: Number(order.status) === 6 ? '已关闭' : order.statusLabel,
    closeReason: getOrderCloseReason(order),
    afterSaleStatus: 'applying',
    afterSaleType: String(type).trim(),
    afterSaleReason: String(reason).trim(),
    afterSaleApplyTime,
  }, '售后申请已提交'))
})

server.get('/order/:id/detail', (req, res) => {
  const id = String(req.params.id)
  const db = router.db

  const order = db.get('orders').find({ id }).value()

  if (!order) {
    res.status(200).jsonp(fail('订单不存在'))
    return
  }

  res.status(200).jsonp(ok({
    order: {
      ...order,
      statusLabel: Number(order.status) === 6 ? '已关闭' : order.statusLabel,
      closeReason: getOrderCloseReason(order),
      afterSaleStatus: order.afterSaleStatus || 'none',
      commentImages: Array.isArray(order.commentImages) ? order.commentImages : [],
      appendCommentImages: Array.isArray(order.appendCommentImages) ? order.appendCommentImages : [],
      afterSaleTimeline: Array.isArray(order.afterSaleTimeline) ? order.afterSaleTimeline : [],
    },
  }))
})

server.post('/order/pay', (req, res) => {
  const { id, payType = 'wechat' } = req.body || {}

  if (!id) {
    res.status(200).jsonp(fail('参数错误'))
    return
  }

  const db = router.db
  const order = db.get('orders').find({ id: String(id) }).value()

  if (!order) {
    res.status(200).jsonp(fail('订单不存在'))
    return
  }

  if (order.status !== 1) {
    res.status(200).jsonp(fail('订单不可支付'))
    return
  }

  const payTime = formatDateTime()

  db.get('orders')
    .find({ id: String(id) })
    .assign({
      ...createOrderStatePatch(2, {
        payTime,
        logisticsStatusText: '商家已收款，待安排发货',
      }),
      payType,
    })
    .write()

  res.status(200).jsonp(
    ok({
      id,
      status: 2,
      statusLabel: '待发货',
      payTime,
    })
  )
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
