const path = require('path')
const AppleTouchIconsPlugin = require('apple-touch-icons-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const Dotenv = require('dotenv-webpack')
// const CopyPlugin = require('copy-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const RobotstxtPlugin = require('robotstxt-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// TODO: migrate to typescript
// TODO: lazyloading - microfrontend - alias - fonts
// TODO: npx husky add .husky/pre-push "yarn test"
// TODO: bug: bundle manifest apple-touch-icon

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
	mode: 'production',
	// performance: {
	//   hints: false
	// },
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[contenthash].js',
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
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: '/node_modules/'
			},
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
				test: /\.(png|jp?g|svg|gif)$/,
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
			template: './public/index.html',
			filename: './index.html',
			inject: true
		}),
		new AppleTouchIconsPlugin(options),
		new RobotstxtPlugin({
			filePath: './robots.txt'
		}),
		new MiniCssExtractPlugin({
			filename: './assets/[name].[contenthash].css'
		}),
		new ImageMinimizerPlugin({
			minimizer: {
				implementation: ImageMinimizerPlugin.imageminMinify,
				options: {
					// Lossless optimization with custom option
					// Feel free to experiment with options for better result for you
					plugins: [
						['gifsicle', { interlaced: true }],
						['jpegtran', { progressive: true }],
						['optipng', { optimizationLevel: 5 }],
						// Svgo configuration here https://github.com/svg/svgo#configuration
						[
							'svgo',
							{
								plugins: [
									{
										name: 'preset-default',
										params: {
											overrides: {
												inlineStyles: {
													onlyMatchedOnce: false
												},
												removeViewBox: false
											}
										}
									}
								]
							}
						]
					]
				}
			}
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
		splitChunks: {
			chunks: 'all'
		},
		minimize: true,
		minimizer: [new TerserPlugin(), new CssMinimizerPlugin()]
	}
}
