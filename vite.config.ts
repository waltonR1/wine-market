import {defineConfig} from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import {UnifiedViteWeappTailwindcssPlugin as uvwt} from 'weapp-tailwindcss/vite'
import {fileURLToPath, URL} from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  // uni 是 uni-app 官方插件， uvtw 一定要放在 uni 后，对生成文件进行处理
  plugins: [
    uni(),
    uvwt({
      rem2rpx: true,
    })
  ],
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer')
      ]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    watch: {
      // 用 ** 通配，避免 Windows / macOS 路径分隔符差异
      ignored: ['**/db.json']
    }
  }
})
