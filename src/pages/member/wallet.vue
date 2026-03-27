<template>
  <view class="min-h-screen bg-background">
    <!-- 余额卡片 -->
    <view class="p-4">
      <view class="bg-primary rounded-3xl p-6 text-text-inverse shadow-lg relative overflow-hidden">
    <view class="absolute right-[-20px] top-[-20px] text-[120px] text-empty-illustration">💰</view>
        <view class="text-[14px] opacity-80 mb-2">账户可用余额 (元)</view>
        <view class="text-[36px] font-bold mb-6">¥ {{ walletInfo.balance.toFixed(2) }}</view>
        <view class="flex gap-4">
          <view
              class="flex-1 bg-warning text-primary text-center py-2.5 rounded-xl text-[14px] font-bold active:opacity-90"
              @click="handleRecharge"
          >
            立即充值
          </view>
          <view
              class="flex-1 bg-overlay-light border border-overlay-border text-text-inverse text-center py-2.5 rounded-xl text-[14px] active:bg-overlay-border"
              @click="handleWithdraw"
          >
            提现
          </view>
        </view>
      </view>
    </view>

    <!-- 资产概览 -->
    <view class="px-4 grid grid-cols-2 gap-4">
      <view class="bg-card p-4 rounded-2xl shadow-sm flex items-center">
        <view class="w-10 h-10 rounded-full bg-danger-soft flex items-center justify-center text-[20px] mr-3">💎</view>
        <view>
          <view class="text-[12px] text-text-muted">我的积分</view>
          <view class="text-[16px] font-bold text-text-main">{{ walletInfo.points }}</view>
        </view>
      </view>
      <view class="bg-card p-4 rounded-2xl shadow-sm flex items-center">
        <view class="w-10 h-10 rounded-full bg-danger-soft flex items-center justify-center text-[20px] mr-3">🎫</view>
        <view>
          <view class="text-[12px] text-text-muted">优惠券</view>
          <view class="text-[16px] font-bold text-text-main">{{ walletInfo.couponCount }} 张</view>
        </view>
      </view>
    </view>

    <!-- 交易记录 -->
    <view class="mt-6 px-4">
      <view class="flex items-center justify-between mb-4">
        <text class="text-[16px] font-bold text-text-main">收支明细</text>
        <text class="text-[12px] text-text-muted">查看全部 ></text>
      </view>
      <view class="bg-card rounded-2xl overflow-hidden shadow-sm">
        <template v-if="records.length > 0">
          <view
              v-for="(record, index) in records"
              :key="index"
              class="flex items-center justify-between p-4 border-b border-divider last:border-0"
          >
            <view>
              <view class="text-[14px] text-text-main mb-1">{{ record.title }}</view>
              <view class="text-[12px] text-text-muted">{{ record.time }}</view>
            </view>
            <view
                class="text-[16px] font-bold"
                :class="record.amount > 0 ? 'text-primary' : 'text-text-main'"
            >
              {{ record.amount > 0 ? '+' : '' }}{{ record.amount.toFixed(2) }}
            </view>
          </view>
        </template>
        <view v-else class="p-10 text-center text-text-muted text-[13px]">
          暂无交易记录
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useMember } from '@/hooks/useMember'

const { walletInfo, fetchWalletInfo } = useMember()

const records = ref([
  { title: '充值金额', time: '2026-03-13 09:30', amount: 1000.00 },
  { title: '购买商品', time: '2026-03-12 15:45', amount: -199.00 },
  { title: '积分兑换余额', time: '2026-03-10 11:20', amount: 50.00 },
])

onShow(() => {
  fetchWalletInfo()
})

const handleRecharge = () => {
  uni.showToast({
    title: '充值功能开发中',
    icon: 'none'
  })
}

const handleWithdraw = () => {
  uni.showToast({
    title: '提现功能开发中',
    icon: 'none'
  })
}
</script>

<style scoped>
</style>
