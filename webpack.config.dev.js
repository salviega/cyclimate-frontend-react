const path = require('path')
const AppleTouchIconsPlugin = require('apple-touch-icons-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const RobotstxtPlugin = require('robotstxt-webpack-plugin')

const options = {
	icon: 'apple-touch-icon.png',
	launch_screen: ['launch-screen-portrait.png', 'launch-screen-landscape.png'],
	ipad: 'ipad.png',
	icon_sizes: [
		[57, 57],
		[72, 72],
		[76, 76],
		[114, 114],
		[120, 120],
		[152, 152],
		[167, 167],
		[180, 180],
		[1024, 1024]
	],
	launch_screen_sizes: [
		[481, 1024],
		[481, 1024]
	],
	ipad_sizes: [
		[568, 320],
		[667, 375],
		[736, 414],
		[812, 375],
		[1024, 768],
		[834, 834],
		[1024, 1024]
	],
	resize: 'crop'
}

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		filename: '[name].[contenthash].js',
		path: path.resolve(__dirname, 'dist'),
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
	devtool: 'source-map',
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
				test: /\.(png|jpg|svg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: { name: 'assets/images/[hash].[ext]' }
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
			filename: './index.html'
		}),
		new AppleTouchIconsPlugin(options),
		new RobotstxtPlugin({
			filePath: './robots.[hash].txt'
		}),
		new MiniCssExtractPlugin({
			filename: './assets/[name].[contenthash].css'
		}),
		new Dotenv()
	],
	devServer: {
		static: path.join(__dirname, 'dist'),
		historyApiFallback: true,
		compress: true,
		open: true,
		port: 3000
	}
}
