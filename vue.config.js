const path = require("path");
const merge = require("webpack-merge");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const tsImportPluginFactory = require("ts-import-plugin");
const UglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const port = process.env.port || process.env.npm_config_port || 8888;
const cdnDomian = "./"; // cdn域名，如果有cdn修改成对应的cdn
const name = "报销系统"; // page title
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const cdn = {
  css: [],
  js: [
    "https://cdn.bootcss.com/vue/2.6.10/vue.min.js",
    "https://cdn.bootcss.com/vue-router/3.0.3/vue-router.min.js",
    "https://cdn.bootcss.com/vuex/3.1.0/vuex.min.js",
    "https://cdn.bootcss.com/axios/0.19.0-beta.1/axios.min.js",
    "https://cdn.bootcss.com/js-cookie/2.2.1/js.cookie.min.js"
  ]
};

const externals = {
  vue: "Vue",
  "vue-router": "VueRouter",
  vuex: "Vuex",
  axios: "axios",
  "js-cookie": "Cookies"
};

function resolve(dir) {
  return path.join(__dirname, dir);
}

// const devServerPort = 9527 // TODO: get this variable from setting.ts
const mockServerPort = 9528; // TODO: get this variable from setting.ts

module.exports = {
  parallel: false,
  publicPath: IS_PRODUCTION ? cdnDomian : "./",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    progress: false,
    proxy: {
      // [process.env.VUE_APP_BASE_API]: {
      //   target: `http://localhost:${mockServerPort}/mock-api/v1`,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     ["^" + process.env.VUE_APP_BASE_API]: ""
      //   }
      // }
      [process.env.VUE_APP_BASE_API]: {
        // target: `http://claim.sdland-sea.com`,
        target: `http://192.168.1.9:8080`,
        changeOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: "/"
        }
      }
    }
  },
  pwa: {
    name: name,
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: path.resolve(__dirname, "src/pwa/service-worker.js")
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      extensions: [".vue", ".ts", ".js"],
      alias: {
        "@": resolve("src"), // 主目录
        views: resolve("src/views"), // 页面
        components: resolve("src/components"), // 组件
        api: resolve("src/api"), // 接口
        utils: resolve("src/utils"), // 通用功能
        assets: resolve("src/assets"), // 静态资源
        style: resolve("src/style") // 通用样式
      }
    }
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      // @import "style/_mixin.scss";@import "style/_variables.scss";@import "style/common.scss";
      patterns: [
        path.resolve(__dirname, "src/styles/_variables.scss"),
        path.resolve(__dirname, "src/styles/_mixins.scss")
      ]
    },
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "src/styles/reset-ui.less")] // less所在文件路径
    }
  },
  chainWebpack(config) {
    config.plugins.delete("preload"); // TODO: need test
    config.plugins.delete("prefetch"); // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    config.module
      .rule("ts")
      .use("ts-loader")
      .tap(options => {
        options = merge(options, {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: "vant",
                libraryDirectory: "es",
                style: true
              })
            ]
          }),
          compilerOptions: {
            module: "es2015"
          }
        });
        return options;
      });
    config.module
      .rule("tsx")
      .use("ts-loader")
      .loader("ts-loader")
      .tap(options => {
        return Object.assign(options || {}, { allowTsInNodeModules: true });
      });

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === "development", config =>
        config.devtool("cheap-source-map")
      );

    config.when(process.env.NODE_ENV !== "development", config => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial" // only package third parties that are initially dependent
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk("single");
      config.stats("errors-only");
    });
    if (IS_PRODUCTION) {
      config.plugin("analyzer").use(BundleAnalyzerPlugin);
      config.plugin("html").tap(args => {
        args[0].cdn = cdn;
        return args;
      });
      config.externals(externals);
      config.plugin("html").tap(args => {
        args[0].minify.minifyCSS = true; // 压缩html中的css
        return args;
      });
      // gzip需要nginx进行配合
      config
        .plugin("compression")
        .use(CompressionWebpackPlugin)
        .tap(() => [
          {
            test: /\.js$|\.html$|\.css/, // 匹配文件名
            threshold: 10240, // 超过10k进行压缩
            deleteOriginalAssets: false // 是否删除源文件
          }
        ]);
      config.optimization.minimizer("minimizer").use(
        new UglifyjsWebpackPlugin({
          // 生产环境推荐关闭 sourcemap 防止源码泄漏
          // 服务端通过前端发送的行列，根据 sourcemap 转为源文件位置
          // sourceMap: true,
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_console: true,
              drop_debugger: true
            }
          }
        })
      );
    }
  },
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: !!IS_PRODUCTION,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    // 启用 CSS modules for all css / pre-processor files.
    requireModuleExtension: true,
    loaderOptions: {
      sass: {
        prependData:
          '@import "style/_mixin.scss";@import "style/_variables.scss";@import "style/common.scss";' // 全局引入
      },
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          modifyVars: {
            // 直接覆盖变量
            // 'text-color': '#111',
            // "grid-item-content-background-color": "#4577beff"
            // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
            hack: `true; @import "${path.resolve(
              __dirname,
              "src/style/reset-ui.less"
            )}";`
          }
        }
      }
    }
  }
};
