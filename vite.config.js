import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//引入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import requireTransform from 'vite-plugin-require-transform'
// const path = require('path')
import path from 'path'
export default defineConfig({
  plugins: [
    vue(),
    //配置插件
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router']
    }),
    // 解决vite不能require的问题
    // requireTransform({
    //   fileRegex: /.js$|.vue$/
    // }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  server:{
    // vite代理
    proxy:{
        '/api':'http://testapi.xuexiluxian.cn'
    }
  },
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});