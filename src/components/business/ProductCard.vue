<template>
  <view
      class="bg-card rounded-3xl overflow-hidden shadow-sm"
      @click="handleClick"
  >
    <view class="relative">
      <image
          :src="product.image"
          class="w-full h-[180px] bg-primary-soft"
          mode="aspectFill"
          lazy-load="true"
          @error="APP_CONFIG.COMMON.IMAGE_PLACEHOLDER"
      />

      <view
          v-if="product.tag"
          class="absolute left-3 top-3 rounded-full bg-tag-brand px-3 py-1 text-[11px] text-text-inverse"
      >
        {{ product.tag }}
      </view>
    </view>

    <view class="p-3">
      <view class="product-title text-[14px] font-semibold text-text-main leading-5">
        {{ product.name }}
      </view>

      <view class="mt-1 product-subtitle text-[12px] text-text-secondary">
        {{ product.subtitle }}
      </view>

      <view class="mt-3 flex items-center justify-between">
        <view class="text-[18px] font-bold text-price">
          ¥{{ product.price }}
        </view>

        <view class="rounded-full bg-warning px-3 py-1 text-[12px] text-text-inverse">
          购买
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { ProductItem } from '@/types/model/goods'
import APP_CONFIG from "@/config/app";

const props = defineProps<{
  product: ProductItem
}>()

const emit = defineEmits<{
  (e: 'click', product: ProductItem): void
}>()

function handleClick() {
  emit('click', props.product)
}
</script>

<style scoped>
.product-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;

  line-clamp: 2;          /* 标准属性 */
  -webkit-line-clamp: 2;  /* WebKit */

  overflow: hidden;

  line-height: 20px;
  height: 40px;           /* 2 × line-height */
}

.product-subtitle {
  display: -webkit-box;
  -webkit-box-orient: vertical;

  line-clamp: 1;
  -webkit-line-clamp: 1;

  overflow: hidden;

  line-height: 16px;
  height: 16px;
}
</style>
