<template>
  <view class="min-h-screen bg-background px-6 pt-16">
    <!-- 顶部品牌区 -->
    <view class="text-center">
      <view class="text-[30px] font-bold text-primary tracking-wide">
        Wine Market
      </view>
      <view class="mt-3 text-[13px] text-text-secondary">
        欢迎来到精品酒类商城
      </view>
    </view>

    <!-- 登录卡片 -->
    <view class="mt-12 bg-card rounded-3xl px-5 py-6 shadow-sm">
      <!-- #ifdef H5 -->
      <view>
        <view class="text-[20px] font-bold text-text-main">
          账号登录
        </view>

        <view class="mt-2 text-[12px] text-text-secondary">
          请输入账号和密码继续使用
        </view>

        <view class="mt-6">
          <view class="text-[13px] text-status-shipping mb-2">
            用户名
          </view>
          <input
              v-model="username"
              class="w-full bg-surface-warm rounded-2xl px-4 py-3 text-[14px] text-text-main"
              placeholder="请输入用户名"
          />
        </view>

        <view class="mt-4">
          <view class="text-[13px] text-status-shipping mb-2">
            密码
          </view>
          <input
              v-model="password"
              class="w-full bg-surface-warm rounded-2xl px-4 py-3 text-[14px] text-text-main"
              placeholder="请输入密码"
              password="true"
          />
        </view>

        <view class="mt-4 text-[12px] text-text-secondary leading-5">
          mock 登录账号：admin
          <br>
          mock 登录密码：123456
        </view>

        <view
            class="mt-6 bg-cta text-text-inverse text-center py-3 rounded-2xl text-[15px] font-medium"
            @click="handleAccountLogin"
        >
          {{ loading ? '登录中...' : '立即登录' }}
        </view>
      </view>
      <!-- #endif -->

      <!-- #ifdef MP-WEIXIN -->
      <view>
        <view class="text-[20px] font-bold text-text-main">
          微信登录
        </view>

        <view class="mt-2 text-[12px] text-text-secondary leading-5">
          登录后可同步购物车、订单与个人信息
        </view>

        <view
            class="mt-8 bg-cta text-text-inverse text-center py-3 rounded-2xl text-[15px] font-medium"
            @click="handleWechatLogin"
        >
          {{ loading ? '登录中...' : '微信一键登录' }}
        </view>
      </view>
      <!-- #endif -->
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useUser } from '@/hooks/useUser'

const username = ref('')
const password = ref('')
const loading = ref(false)
const redirectUrl = ref('')

const { login: accountLogin, wechatLogin: wxLogin } = useUser()

onLoad((options) => {
  redirectUrl.value = decodeURIComponent(options?.redirect || '')
})

function goAfterLogin() {
  if (redirectUrl.value) {
    uni.redirectTo({
      url: redirectUrl.value,
    })
    return
  }

  uni.switchTab({
    url: '/pages/member/index',
  })
}

async function handleAccountLogin() {
  if (!username.value.trim()) {
    uni.showToast({
      title: '请输入用户名',
      icon: 'none',
    })
    return
  }

  if (!password.value.trim()) {
    uni.showToast({
      title: '请输入密码',
      icon: 'none',
    })
    return
  }

  if (loading.value) return
  loading.value = true

  try {
    const ok = await accountLogin({
      username: username.value.trim(),
      password: password.value.trim(),
    })
    if (ok) {
      setTimeout(() => {
        goAfterLogin()
      }, 300)
    }
  } finally {
    loading.value = false
  }
}

async function handleWechatLogin() {
  if (loading.value) return
  loading.value = true

  try {
    const loginRes = await uni.login({
      provider: 'weixin',
    })

    const code = loginRes.code
    if (!code) {
      uni.showToast({
        title: '获取微信登录凭证失败',
        icon: 'none',
      })
      return
    }

    const ok = await wxLogin(code)
    if (ok) {
      setTimeout(() => {
        goAfterLogin()
      }, 300)
    }
  } finally {
    loading.value = false
  }
}
</script>
