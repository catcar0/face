const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false
})
module.exports = {
  publicPath: './',
  devServer: {
    proxy: {
      /* 匹配所有以'/api'开头的请求路径 */
      // '/api': {
      //   target: `https://sm.ms/api/v2`,
      //   changeOrigin:true, // 允许跨域
      //   pathRewrite: {
      //     '^/api': ''
      //   },
      // },
      /* 匹配所有以'/demo'开头的请求路径 */
      '/aab': {
        target: 'https://sm.ms/api/v2',//代理目标的基础路径
        changeOrigin:true, // 允许跨域
        pathRewrite: {  // 重命名
          '^/aab': ''
        },
        // ws: true,//用于支持websocket
        // changeOrigin: true,//用于请求头中的host值
      }
    }
  },
}
/* 
changeOrigin设置为true时，服务器收到的请求中的host为：localhost:5000
changeOrigin设置为false时，服务器收到的请求中的host为：localhost:8000
changeOrigin:默认值为true
*/

