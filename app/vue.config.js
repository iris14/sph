const { defineConfig } = require('@vue/cli-service')
module.exports = {
  productionSourceMap:false,
  lintOnSave:false,
  devServer: {
    client: {
      overlay: false
    },
    proxy: {
      '/api': {
        target: 'http://gmall-h5-api.atguigu.cn', 
        // pathRewrite: { '^/api': '' },
      },
    },
    
  },
}
