const path = require('path')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const Dotenv = require('dotenv-webpack')
// const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  // performance: {
  //   hints: false
  // },
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    // TODO: Generate alias
    // alias: {
    //     "@images": path.resolve(__dirname, "src/assets/images/"),
    //   },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    fallback: {
      crypto: false,
      stream: false
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|svg|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: { name: 'assets/[hash].[ext]' }
          }
        ]
      }
      // TODO: Update fonts
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './public/index.html',
      filename: './index.html',
      favicon: './public/favicon.ico',
      manifest: './public/manifest.json'
    }),
    new MiniCssExtractPlugin({
      filename: './[name].css'
    }),
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, 'src', 'assets/images'),
    //       to: 'assets/images'
    //     }
    //   ]
    // })
    new CleanWebpackPlugin(),
    new Dotenv()
  ],
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()]
  }
}
