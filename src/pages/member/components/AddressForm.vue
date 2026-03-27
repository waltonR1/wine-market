<template>
  <view class="fixed inset-0 z-50">
    <view class="absolute inset-0 bg-overlay-mask" @click="$emit('close')" />

    <view class="absolute left-0 right-0 bottom-0 bg-card rounded-t-3xl px-4 pt-4 pb-6 safe-area-inset-bottom">
      <view class="flex items-center justify-between mb-3">
        <view class="text-[16px] font-bold text-text-main">
          {{ isEdit ? '编辑地址' : '新增地址' }}
        </view>
      </view>

      <view class="space-y-3">
        <input
          v-model="form.name"
          placeholder="收货人"
          class="bg-surface-muted rounded-lg px-3 py-2 text-[13px] mb-1"
        />

        <input
          v-model="form.phone"
          placeholder="手机号"
          class="bg-surface-muted rounded-lg px-3 py-2 text-[13px] mb-1"
        />

        <picker mode="region" @change="handleRegionChange">
          <view class="bg-surface-muted rounded-lg px-3 py-2 text-[13px] mb-1">
            <text v-if="form.province">
              {{ form.province }} {{ form.city }} {{ form.district }}
            </text>
            <text v-else class="text-text-muted">
              请选择省 / 市 / 区
            </text>
          </view>
        </picker>

        <input
          v-model="form.detail"
          placeholder="详细地址"
          class="bg-surface-muted rounded-lg px-3 py-2 text-[13px]"
        />

        <view class="flex items-center justify-between pt-1">
          <view class="text-[13px] text-text-main">设为默认地址</view>
          <switch
            :checked="form.isDefault"
            :color="COLORS.link"
            @change="handleDefaultSwitch"
          />
        </view>

        <view v-if="form.isDefault" class="text-[11px] text-text-muted mt-1">
          设为默认后，将自动替换当前默认地址
        </view>
      </view>

      <view class="mt-5 flex gap-3">
        <view
          class="flex-1 bg-surface-muted text-text-main text-center py-3 rounded-full text-[14px]"
          @click="$emit('close')"
        >
          取消
        </view>
        <view
          class="flex-1 bg-cta text-text-inverse text-center py-3 rounded-full text-[14px] font-medium"
          @click="$emit('submit')"
        >
          保存
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { COLORS } from '@/constants'
import type { AddressFormModel } from '@/types/model/address'

defineProps<{
  form: AddressFormModel
  isEdit: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit'): void
  (e: 'defaultChange', value: boolean): void
  (e: 'regionChange', value: string[]): void
}>()

function handleDefaultSwitch(e: any) {
  emit('defaultChange', Boolean(e?.detail?.value))
}

function handleRegionChange(e: any) {
  emit('regionChange', e?.detail?.value || [])
}
</script>

<style scoped>
.safe-area-inset-bottom {
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
}
</style>


