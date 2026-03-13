<template>
  <view class="min-h-screen bg-[#F7F3EE] px-6 pt-16">
    <!-- 顶部品牌区 -->
    <view class="text-center">
      <view class="text-[30px] font-bold text-[#4A0D12] tracking-wide">
        Wine Market
      </view>
      <view class="mt-3 text-[13px] text-[#8B7B6B]">
        欢迎来到精品酒类商城
      </view>
    </view>

    <!-- 登录卡片 -->
    <view class="mt-12 bg-white rounded-3xl px-5 py-6 shadow-sm">
      <!-- #ifdef H5 -->
      <view>
        <view class="text-[20px] font-bold text-[#2C2C2C]">
          账号登录
        </view>

        <view class="mt-2 text-[12px] text-[#8B7B6B]">
          请输入账号和密码继续使用
        </view>

        <view class="mt-6">
          <view class="text-[13px] text-[#4B3A2F] mb-2">
            用户名
          </view>
          <input
              v-model="username"
              class="w-full bg-[#F5F1EC] rounded-2xl px-4 py-3 text-[14px] text-[#2C2C2C]"
              placeholder="请输入用户名"
          />
        </view>

        <view class="mt-4">
          <view class="text-[13px] text-[#4B3A2F] mb-2">
            密码
          </view>
          <input
              v-model="password"
              class="w-full bg-[#F5F1EC] rounded-2xl px-4 py-3 text-[14px] text-[#2C2C2C]"
              placeholder="请输入密码"
              password
          />
        </view>

        <view class="mt-4 text-[12px] text-[#8B7B6B] leading-5">
          mock 登录账号：admin
          <br>
          mock 登录密码：123456
        </view>

        <view
            class="mt-6 bg-[#6B0F1A] text-white text-center py-3 rounded-2xl text-[15px] font-medium"
            @click="handleAccountLogin"
        >
          {{ loading ? '登录中...' : '立即登录' }}
        </view>
      </view>
      <!-- #endif -->

      <!-- #ifdef MP-WEIXIN -->
      <view>
        <view class="text-[20px] font-bold text-[#2C2C2C]">
          微信登录
        </view>

        <view class="mt-2 text-[12px] text-[#8B7B6B] leading-5">
          登录后可同步购物车、订单与个人信息
        </view>

        <view
            class="mt-8 bg-[#6B0F1A] text-white text-center py-3 rounded-2xl text-[15px] font-medium"
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
import { login, wechatLogin } from '@/api'
import { setToken } from '@/utils/auth'

const username = ref('')
const password = ref('')
const loading = ref(false)
const redirectUrl = ref('')

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
  // #ifndef H5
  return
  // #endif

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
    const res = await login({
      username: username.value.trim(),
      password: password.value.trim(),
    })

    if (res.code === 0) {
      setToken(res.data.token)

      uni.showToast({
        title: '登录成功',
        icon: 'success',
      })

      setTimeout(() => {
        goAfterLogin()
      }, 300)
    } else {
      uni.showToast({
        title: res.message || '登录失败',
        icon: 'none',
      })
    }
  } catch (error) {
    uni.showToast({
      title: '登录请求失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

async function handleWechatLogin() {
  // #ifndef MP-WEIXIN
  return
  // #endif

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

    const res = await wechatLogin(code)

    if (res.code === 0) {
      setToken(res.data.token)

      uni.showToast({
        title: '登录成功',
        icon: 'success',
      })

      setTimeout(() => {
        goAfterLogin()
      }, 300)
    } else {
      uni.showToast({
        title: res.message || '登录失败',
        icon: 'none',
      })
    }
  } catch (error) {
    uni.showToast({
      title: '微信登录失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}
</script>