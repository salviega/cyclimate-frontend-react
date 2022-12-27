const path = require('path')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
// const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'production',
  performance: {
    hints: false
  },
  entry: './src/index.js',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
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
        type: 'asset/resource'
      }
      // TODO: Update fonts

    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      filename: './[name].html',
      template: './public/index.html',
      favicon: './public/favicon.ico',
      manifest: './public/manifest.json'
    }),
    new MiniCssExtractPlugin({
      filename: './[name].css'
    })
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, 'src', 'assets/images'),
    //       to: 'assets/images'
    //     }
    //   ]
    // })

    // TODO: Update environment variables
    // new Dotenv(),
  ],
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()]
  }
}
