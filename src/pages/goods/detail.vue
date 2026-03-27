<template>
  <view v-if="product" class="min-h-screen bg-background pb-[100px]">
    <image :src="product.image" class="mb-5 h-[320px] w-full bg-primary-soft" mode="aspectFill" />

    <view class="-mt-6 rounded-t-3xl bg-card p-5">
      <view class="text-[20px] font-bold leading-6 text-text-main">{{ product.name }}</view>

      <view class="mt-2 text-[13px] text-text-secondary">{{ product.subtitle }}</view>

      <view class="mt-3 flex items-center justify-between">
        <view class="text-[12px] text-text-secondary">
          库存：
          <text class="font-medium text-entry-label">{{ product.stock }}</text>
        </view>
        <view v-if="product.sales" class="text-[12px] text-text-secondary">
          {{ product.sales }} 人已购买
        </view>
      </view>

      <view class="mt-4 text-[26px] font-bold text-price">￥{{ product.price }}</view>

      <view class="my-1 h-[1px] bg-divider"></view>

      <view class="mt-6">
        <view class="flex border-b border-divider">
          <view
            class="flex-1 py-3 text-center text-[13px]"
            :class="activeTab === 'detail' ? 'font-medium text-text-main' : 'text-text-secondary'"
            @click="activeTab = 'detail'"
          >
            图文详情
          </view>
          <view
            class="flex-1 py-3 text-center text-[13px]"
            :class="activeTab === 'params' ? 'font-medium text-text-main' : 'text-text-secondary'"
            @click="activeTab = 'params'"
          >
            商品参数
          </view>
          <view
            class="flex-1 py-3 text-center text-[13px]"
            :class="activeTab === 'comments' ? 'font-medium text-text-main' : 'text-text-secondary'"
            @click="activeTab = 'comments'"
          >
            买家评论({{ commentCount }})
          </view>
        </view>

        <view v-if="activeTab === 'detail'" class="mt-4">
          <view v-for="(block, idx) in product.detail" :key="idx">
            <view v-if="block.type === 'title'" class="text-[16px] font-bold text-text-main">
              {{ block.value }}
            </view>
            <view
              v-else-if="block.type === 'text'"
              class="mt-3 text-[13px] leading-6 text-text-secondary"
            >
              {{ block.value }}
            </view>
            <image
              v-else
              :src="block.value"
              class="mt-4 w-full rounded-2xl bg-primary-soft"
              mode="widthFix"
            />
          </view>
        </view>

        <view v-else-if="activeTab === 'params'" class="mt-4">
          <view class="overflow-hidden rounded-2xl bg-surface-warm">
            <view
              v-for="(p, idx) in product.params"
              :key="idx"
              class="flex border-b border-surface px-4 py-3"
            >
              <view class="w-[90px] text-[12px] text-text-secondary">{{ p.label }}</view>
              <view class="flex-1 text-[12px] text-text-main">{{ p.value }}</view>
            </view>
            <view
              v-if="product.params.length === 0"
              class="px-4 py-6 text-center text-[13px] text-text-secondary"
            >
              暂无参数
            </view>
          </view>
        </view>

        <view v-else class="mt-4">
          <view
            v-for="comment in product.comments"
            :key="comment.id"
            class="mb-4 rounded-2xl bg-surface-warm p-4"
          >
            <view class="flex items-center justify-between">
              <view class="flex items-center">
                <image :src="comment.avatar" class="h-[34px] w-[34px] rounded-full bg-card" mode="aspectFill" />
                <view class="ml-3">
                  <view class="flex items-center gap-2">
                    <view class="text-[13px] font-medium text-text-main">{{ comment.userName }}</view>
                    <view
                      v-if="comment.anonymous"
                      class="rounded-full bg-primary-soft px-2 py-[2px] text-[10px] text-status-shipping"
                    >
                      匿名
                    </view>
                  </view>
                  <view class="mt-0.5 text-[11px] text-text-secondary">{{ comment.time }}</view>
                </view>
              </view>
              <view class="text-[12px] text-rating">{{ renderStars(comment.score) }}</view>
            </view>

            <view class="mt-3 text-[13px] leading-6 text-text-secondary">{{ comment.content }}</view>

            <view v-if="comment.images?.length" class="mt-3 grid grid-cols-3 gap-2">
              <image
                v-for="(img, idx) in comment.images"
                :key="idx"
                :src="img"
                class="h-[90px] w-full rounded-xl bg-card"
                mode="aspectFill"
              />
            </view>

            <view
              v-if="comment.appendContent || comment.appendTime || comment.appendImages?.length"
              class="mt-4 rounded-2xl border border-border bg-surface p-3"
            >
              <view class="flex items-center justify-between">
                <text class="text-[12px] font-medium text-status-shipping">追加评价</text>
                <text class="text-[11px] text-text-secondary">{{ comment.appendTime || '-' }}</text>
              </view>
              <view v-if="comment.appendContent" class="mt-2 text-[12px] leading-6 text-text-secondary">
                {{ comment.appendContent }}
              </view>
              <view v-if="comment.appendImages?.length" class="mt-3 grid grid-cols-3 gap-2">
                <image
                  v-for="(img, idx) in comment.appendImages"
                  :key="idx"
                  :src="img"
                  class="h-[86px] w-full rounded-xl bg-card"
                  mode="aspectFill"
                />
              </view>
            </view>
          </view>

          <view
            v-if="product.comments.length === 0"
            class="py-8 text-center text-[13px] text-text-secondary"
          >
            暂无评论
          </view>
        </view>
      </view>
    </view>

    <view class="fixed bottom-0 left-0 right-0 flex items-center justify-between border-t border-divider bg-card px-4 py-3">
      <view class="text-[20px] font-bold text-price">￥{{ product.price }}</view>

      <view class="flex gap-3">
        <view class="rounded-full border border-link px-4 py-2 text-[13px] text-link" @click="addCart">
          加入购物车
        </view>

        <view
          class="rounded-full bg-cta px-5 py-2 text-[13px] text-text-inverse"
          :class="product.stock <= 0 ? 'opacity-50' : ''"
          @click="buyNow"
        >
          立即购买
        </view>
      </view>
    </view>
  </view>

  <view v-else class="min-h-screen flex items-center justify-center text-text-secondary">
    商品加载中...
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { useGoodsDetail } from '@/hooks/useGoodsDetail'
import { useCart } from '@/hooks/useCart'
import { useOrderStore } from '@/store/order'

const { product, fetchProductDetail } = useGoodsDetail()
const { addProductToCart } = useCart()
const orderStore = useOrderStore()

const activeTab = ref<'detail' | 'params' | 'comments'>('detail')
const commentCount = computed(() => product.value?.comments?.length ?? product.value?.comment ?? 0)

onLoad(async (options) => {
  const id = Number(options?.id)
  await fetchProductDetail(id)
})

function renderStars(score: number) {
  const safeScore = Math.max(0, Math.min(5, score || 0))
  const filled = '★'.repeat(safeScore)
  const empty = '☆'.repeat(5 - safeScore)
  return `${filled}${empty}`
}

function addCart() {
  if (!product.value) return
  addProductToCart(product.value)
}

function buyNow() {
  if (!product.value) return

  if (product.value.stock <= 0) {
    uni.showToast({
      title: '库存不足',
      icon: 'none',
    })
    return
  }

  orderStore.setConfirmGoods([
    {
      id: product.value.id,
      name: product.value.name,
      spec: product.value.subtitle || '',
      price: product.value.price,
      count: 1,
      image: product.value.image,
      stock: product.value.stock,
    },
  ])

  uni.navigateTo({
    url: '/pages/order/confirm',
  })
}
</script>
