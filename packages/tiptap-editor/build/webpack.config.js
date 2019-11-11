import path from 'path'
import webpack from 'webpack'
import DartSass from 'dart-sass'
import { VueLoaderPlugin } from 'vue-loader'
import SvgStore from 'webpack-svgstore-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ManifestPlugin from 'webpack-manifest-plugin'
import ImageminWebpackPlugin from 'imagemin-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import { ifDev, ifProd, removeEmpty } from './utilities'
import { rootPath, srcPath, buildPath } from './paths'

console.log(ifDev('vue-style-loader', MiniCssExtractPlugin.loader))

export default {

  mode: ifDev('development', 'production'),

  entry: {
    editor: removeEmpty([
      ifDev('webpack-hot-middleware/client?reload=true'),
      `${srcPath}/assets/sass/index.scss`,
      `${srcPath}/index.js`,
    ]),
  },

  output: {
    path: `${buildPath}/`,
    filename: `[name].js`,
    publicPath: '/',
    libraryTarget: 'umd'
  },

  resolve: {
    extensions: ['.js', '.scss'],
    alias: {
      modules: path.resolve(rootPath, '../../node_modules'),
      images: `${srcPath}/assets/images`,
      fonts: `${srcPath}/assets/fonts`,
      variables: `${srcPath}/assets/sass/variables`,
      tiptap: path.resolve(rootPath, '../../packages/tiptap/src'),
      'tiptap-commands': path.resolve(rootPath, '../../packages/tiptap-commands/src'),
      'tiptap-utils': path.resolve(rootPath, '../../packages/tiptap-utils/src'),
      'tiptap-models': path.resolve(rootPath, '../../packages/tiptap-models/src'),
      'tiptap-extensions': path.resolve(rootPath, '../../packages/tiptap-extensions/src'),
    },
    modules: [
      srcPath,
      path.resolve(rootPath, '../../node_modules'),
    ],
  },

  devtool: ifDev('eval-source-map', 'source-map'),

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: {
          loader: ifDev('babel-loader?cacheDirectory=true', 'babel-loader'),
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
            ],
            plugins: [
              '@babel/plugin-syntax-dynamic-import',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: removeEmpty([
          ifProd(MiniCssExtractPlugin.loader),
          'css-loader',
          'postcss-loader',
        ]),
      },
      {
        test: /\.scss$/,
        use: removeEmpty([
          ifProd(MiniCssExtractPlugin.loader),
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: DartSass,
            },
          },
        ]),
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: `assets/images/[name]${ifProd('.[hash]', '')}.[ext]`,
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: `assets/fonts/[name]${ifProd('.[hash]', '')}.[ext]`,
          },
        },
      },
    ],
  },

  // splitting out the vendor
  optimization: {
    namedModules: true,
    splitChunks: {
      name: 'vendor',
      minChunks: 2,
    },
    noEmitOnErrors: true,
    // concatenateModules: true,
  },

  plugins: removeEmpty([
    // define env
    // new webpack.DefinePlugin({
    // 	'process.env': {},
    // }),


    // enable hot reloading
    ifDev(new webpack.HotModuleReplacementPlugin()),

    // html
    ifDev(
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: `${srcPath}/index.html`,
        inject: true,
        minify: ifProd({
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
        }),
        buildVersion: new Date().valueOf(),
        chunksSortMode: 'none',
      })
    ),

    // create css files
    ifProd(new MiniCssExtractPlugin({
      filename: `[name].css`,
      chunkFilename: `[name].css`,
    })),

    // minify css files
    ifProd(new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        reduceIdents: false,
        autoprefixer: false,
        zindex: false,
        discardComments: {
          removeAll: true,
        },
      },
    })),

    // svg icons
    ifDev(
      new SvgStore({
        prefix: 'icon--',
        svgoOptions: {
          plugins: [
            { cleanupIDs: false },
            { collapseGroups: false },
            { removeTitle: true },
          ],
        },
      })
    ),

    // image optimization
    ifDev(
      new ImageminWebpackPlugin({
        optipng: ifDev(null, {
          optimizationLevel: 3,
        }),
        jpegtran: ifDev(null, {
          progressive: true,
          quality: 80,
        }),
        svgo: ifDev(null, {
          plugins: [
            { cleanupIDs: false },
            { removeViewBox: false },
            { removeUselessStrokeAndFill: false },
            { removeEmptyAttrs: false },
          ],
        }),
      })
    ),

  ]),

  node: {
    fs: 'empty',
  },

  externals: {
    react: 'react',
    'react-dom': 'react-dom',
  }

}
