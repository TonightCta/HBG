// vue.config.js

const CompressionWebpackPlugin = require('compression-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';

const cdn = {
  css: [
    // 'https://cdn.staticfile.org/mint-ui/2.2.13/popup/style.min.css',
    // 'https://cdn.staticfile.org/mint-ui/2.2.13/loadmore/style.min.css',
    // 'https://cdn.staticfile.org/mint-ui/2.2.13/toast/style.min.css',
  ],
  js: [
    'https://cdn.staticfile.org/vue/2.6.11/vue.runtime.min.js',
    'https://cdn.staticfile.org/vue-router/3.1.6/vue-router.min.js',
    'https://cdn.staticfile.org/vuex/3.2.0/vuex.min.js',
    'https://cdn.staticfile.org/vue-i18n/8.17.4/vue-i18n.min.js',
    'https://cdn.staticfile.org/axios/0.19.0/axios.min.js',
    // 'https://cdn.staticfile.org/mint-ui/2.2.13/popup/index.min.js',
    // 'https://cdn.staticfile.org/mint-ui/2.2.13/loadmore/index.min.js',
    // 'https://cdn.staticfile.org/mint-ui/2.2.13/toast/index.min.js',
  ]
};

module.exports = {
  // 配置项
  // 开发服务配置
  devServer: {
    open: true,
    port: 2002,
    proxy: { // 代理控制
      '/api': {
        target: `https://hbg.finance/`,
        ws: false,
        changeOrigin: true
      },
    },
  },
  css:{
    extract: false, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false, // 开启 CSS source maps
    requireModuleExtension: true, // 启用 CSS modules for all css / pre-processor files.
    loaderOptions: {
      sass: {
        prependData: `@import "~@/assets/css/color.scss";@import "~@/assets/css/mixin.scss";@import "~@/assets/css/animation.scss";`
      }
    }
  },
  chainWebpack: config => {
    // 生产环境配置
    if (isProduction) {
      // 删除预加载
      // config.plugins.delete('preload');
      // config.plugins.delete('prefetch');
      // 分割代码
      // config.optimization.splitChunks({
      //   chunks: 'all'
      // });
      // 生产环境注入cdn
      config.plugin('html').tap(args => {
        args[0].cdn = cdn;
        return args;
      });
    }
  },
  configureWebpack: config => {
    // 开启gzip压缩
    if (isProduction) {
      config.externals = {
        'vue': 'Vue',
        'vuex': 'Vuex',
        'vue-router': 'VueRouter',
        'vue-i18n': 'VueI18n',
        'axios': 'axios'
      }
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: /\.js$|\.html$|\.json$|\.css/,
        threshold: 10240,
        minRatio: 0.8
      }));
      // config.optimization = {
      //   runtimeChunk: 'single',
      //   splitChunks: {
      //     chunks: 'async',
      //     maxInitialRequests: Infinity,
      //     minSize: 20000,
      //     cacheGroups: {
      //       vendor: {
      //         test: /[\\/]node_modules[\\/]/,
      //         name (module) {
      //           // get the name. E.g. node_modules/packageName/not/this/part.js
      //           // or node_modules/packageName
      //           const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
      //           // npm package names are URL-safe, but some servers don't like @ symbols
      //           return `npm.${packageName.replace('@', '')}`
      //         }
      //       }
      //     }
      //   }
      // };
      // 取消webpack警告的性能提示
      config.performance = {
        hints:'warning',
            //入口起点的最大体积
            maxEntrypointSize: 50000000,
            //生成文件的最大体积
            maxAssetSize: 30000000,
            //只给出 js 文件的性能提示
            assetFilter: function(assetFilename) {
          return assetFilename.endsWith('.js');
        }
      }
    }
  },
  // 资源文件目录
  publicPath: isProduction ? '/' : '/',
  // 将构建好的文件输出到位置
  outputDir: 'dist',
  // 放置生成的静态资源 (js、css、images、fonts) 的 (相对于 outputDir 的) 目录。
	assetsDir: 'static',
  indexPath: 'index.html',
  // 是否为生产环境构建生成 source map？
  productionSourceMap: false,

  // 三方插件的选项
  pluginOptions: {
    // ...
  },
}
