const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OSSPlugin = require('webpack-aliyun-oss');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ConsolePlugin = require('vconsole-webpack-plugin');
// const CosPlugin = require('tencent-cloud-webpack-plugin');
const filterObject = (obj) => {
  const result = {};
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    const val = obj[key];
    if (val === null || val === undefined) {
      continue;
    }
    result[key] = val;
  }
  return result;
};
const filterArray = (arr) => {
  const result = [];
  arr.forEach(function (item) {
    if (item === null || item === undefined) {
      return;
    }
    result.push(item);
  });
  return result;
};

module.exports = (env, argv) => {
  /** 配置参数 **/
  // see https://webpack.js.org/configuration/mode/
  const MODE = argv.mode; // 模式
  const DEV = MODE === 'development';
  const ANALYSIS = env.analysis === 'true'; // 是否分析报告
  const CONSOLE = env.console === 'true'; // 是否显示控制台组件
  const MINIFY = !DEV && env.minify !== 'false'; // 是否最小化js/css
  const SERVER_ENV = env.serverEnv; // API环境
  const CDN = env.cdn; // CDN环境
  const BUILD_DIR = 'dist'; // 打包目录
  const VENDOR = env.cdnVendor || 'oss';
  let PUBLIC_PATH = '/';
  let CDN_PLUGIN = null;
  if (CDN && CDN != 'none') {
    const getTimestamp = function () {
      const pad = function (s) {
        s = s.toString();
        return s.length > 1 ? s : '0' + s;
      };
      const date = new Date();
      const y = date.getFullYear().toString();
      const m = pad(date.getMonth() + 1);
      const d = pad(date.getDate());
      const hour = pad(date.getHours());
      const minute = pad(date.getMinutes());
      return y + m + d + hour + minute;
    };
    const cdnConfigs = require('./cdn.' + VENDOR);
    const cdnConfig = cdnConfigs[CDN];
    const storagePath = cdnConfig.path + '/' + getTimestamp();
    // COS上传需要包含打包目录本身
    PUBLIC_PATH = cdnConfig.publicPath + storagePath + (VENDOR === 'oss' ? '' : '/' + BUILD_DIR) + '/';
    if (VENDOR == 'oss') {
      CDN_PLUGIN = new OSSPlugin({
        from: ['./' + BUILD_DIR + '/**'],
        accessKeyId: cdnConfig.secretId,
        accessKeySecret: cdnConfig.secretKey,
        bucket: cdnConfig.bucket,
        region: cdnConfig.region,
        dist: storagePath,
      });
    } else if (VENDOR == 'cos') {
      CDN_PLUGIN = new CosPlugin({
        secretId: cdnConfig.secretId,
        secretKey: cdnConfig.secretKey,
        bucket: cdnConfig.bucket,
        region: cdnConfig.region,
        path: storagePath,
      });
    } else {
      throw 'Failed to getUploadPlugin';
    }
  }
  console.log('====================env:', env);
  console.log('====================argv:', argv);
  console.log('====================MODE:', MODE);
  console.log('====================DEV:', DEV);
  console.log('====================SERVER_ENV:', SERVER_ENV);
  console.log('====================ANALYSIS:', ANALYSIS);
  console.log('====================CONSOLE:', CONSOLE);
  console.log('====================MINIFY:', MINIFY);
  console.log('====================PUBLIC_PATH:', PUBLIC_PATH);

  return filterObject({
    mode: MODE,
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.less', '.scss'],
      alias: {
        '@config': path.resolve(__dirname, 'src/config'),
        '@common': path.resolve(__dirname, 'src/common'),
        '@comp': path.resolve(__dirname, 'src/comp'),
        '@img': path.resolve(__dirname, 'src/img'),
        '@css': path.resolve(__dirname, 'src/css'),
      },
    },
    entry: {
      index: './src/index.jsx',
    },
    output: {
      filename: 'js/[name].[chunkhash:7].js', //chunkhash
      chunkFilename: 'js/[name].[chunkhash:7].chunk.js',
      path: path.resolve(__dirname, BUILD_DIR),
      publicPath: PUBLIC_PATH,
    },
    devServer: DEV
      ? {
          port: 9000,
          historyApiFallback: true,
          compress: true,
        }
      : null,
    devtool: DEV ? 'eval-cheap-module-source-map' : null,
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.tsx?$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'ts-loader',
          },
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                esModule: false,
                name: 'img/[name].[hash:7].[ext]',
                limit: 1024,
                publicPath: PUBLIC_PATH,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.less$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'],
        },
        {
          test: /\.(sass|scss)$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
        },
      ],
    },
    plugins: filterArray([
      new webpack.DefinePlugin({
        SERVER_ENV: JSON.stringify(SERVER_ENV),
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: 'src/public/index.html',
        filename: 'index.html',
        inject: 'body',
        minify: {
          html5: false,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          minifyURLs: false,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
      }),
      new MiniCssExtractPlugin({
        filename: 'style/[name].[hash:7].css',
      }),
      CDN_PLUGIN,
      ANALYSIS ? new BundleAnalyzerPlugin({ analyzerPort: env.analyzerPort || 9099 }) : null,
      CONSOLE ? new ConsolePlugin({ enable: true }) : null,
    ]),
    optimization: DEV
      ? null
      : {
          minimize: true,
          minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin({
              parallel: true,
              extractComments: false,
              terserOptions: {
                format: {
                  comments: false,
                },
                compress: {
                  drop_console: true,
                },
              },
            }),
          ],
          splitChunks: {
            chunks: 'all',
            // 1200KB - 按300KB为弱网环境算,1秒加载完毕(4倍为gzip压缩比)
            maxSize: 1024 * 300 * 4,
            minSize: 1024 * 300 * 4,
            cacheGroups: {
              default: false,
              libs: {
                test: /[\\/]node_modules[\\/]/,
                name: 'libs',
                priority: 10,
                chunks: 'initial',
              },
              // 项目公共组件目前暂不分离
              // common: {
              //   test: /[\\/]src[\\/]common[\\/]/,
              //   name: 'common',
              //   priority: 9,
              //   chunks: 'all',
              // },
            },
          },
          runtimeChunk: {
            name: 'manifest',
          },
        },
  });
};
