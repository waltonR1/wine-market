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

// server.get('/goods_:id', (req, res) => {
//   const id = Number(req.params.id)
//   if (!Number.isFinite(id)) {
//     res.status(200).jsonp(fail('参数错误'))
//     return
//   }
//   const db = router.db
//   const goods = db.get('goods').find({ id }).value()
//   if (!goods) {
//     res.status(200).jsonp(fail('商品不存在'))
//     return
//   }
//   res.status(200).jsonp(ok(buildGoodsDetail(goods)))
// })

server.get('/order_list', (req, res) => {
  req.url = '/orders'
  router(req, res)
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

server.get('/cart_list', (req, res) => {
  req.url = '/cart'
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
    db.get('cart').find({ id: goodsId }).assign({ count: existing.count + addCount }).write()
  } else {
    db.get('cart')
      .push({
        id: goods.id,
        name: goods.name,
        price: goods.price,
        count: addCount,
        image: goods.image,
      })
      .write()
  }

  res.status(200).jsonp(ok(db.get('cart').value(), '加入购物车成功'))
}

function handleUpdateCartCount(req, res, cartId, nextCount) {
  if (!Number.isFinite(cartId) || !Number.isFinite(nextCount) || nextCount < 1) {
    res.status(200).jsonp(fail('商品数量不能小于 1'))
    return
  }

  const db = router.db
  const existing = db.get('cart').find({ id: cartId }).value()
  if (!existing) {
    res.status(200).jsonp(fail('购物车商品不存在'))
    return
  }

  db.get('cart').find({ id: cartId }).assign({ count: nextCount }).write()
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
server.post('/cart_add', handleAddToCart)

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

server.post('/cart_update_count', (req, res) => {
  const { id, count } = req.body || {}
  handleUpdateCartCount(req, res, Number(id), Number(count))
})

server.post('/cart_delete', (req, res) => {
  const { id } = req.body || {}
  handleDeleteCartItem(req, res, Number(id))
})

server.post('/cart_batch_delete', (req, res) => {
  const { ids } = req.body || {}
  const db = router.db
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(200).jsonp(fail('参数错误'))
    return
  }
  ids.map(Number).filter(Number.isFinite).forEach((id) => {
    db.get('cart').remove({ id }).write()
  })
  res.status(200).jsonp(ok(db.get('cart').value(), '批量删除成功'))
})

server.post('/cart_clear', (req, res) => {
  const db = router.db
  db.set('cart', []).write()
  res.status(200).jsonp(ok(null, '购物车已清空'))
})

server.post('/cart_update_checked', (req, res) => {
  res.status(200).jsonp(ok(router.db.get('cart').value(), '已忽略 checked'))
})

server.post('/cart_update_all_checked', (req, res) => {
  res.status(200).jsonp(ok(router.db.get('cart').value(), '已忽略 checked'))
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

function clearAllDefault(db) {
  const list = db.get('addresses').value() || []
  db.set(
    'addresses',
    list.map(item => ({
      ...item,
      isDefault: false,
    }))
  ).write()
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
