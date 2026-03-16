const colors = require('./src/constants/colors.json')

// 判断当前编译平台是否为 H5
const isH5 = process.env.UNI_PLATFORM === 'h5'

/** @type {import('tailwindcss').Config} */
module.exports = {
  // 这里给出了一份 uni-app /taro 通用示例，具体要根据你自己项目的目录结构进行配置
  // 不在 content 包括的文件内，你编写的 class，是不会生成对应的css工具类的
  content: ['./public/index.html', './src/**/*.{html,js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ...colors,
      },
    },
  },
  // 这里的核心插件根据平台进行动态配置
  corePlugins: {
    // 小程序环境下禁用 preflight 和 container 以减小体积并避免样式冲突
    // H5 环境下保留以提供完整的 Tailwind 开发体验
    preflight: isH5,
    container: isH5,
  },
}
