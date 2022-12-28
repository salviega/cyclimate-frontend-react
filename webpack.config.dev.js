const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
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
		})
	],
	devServer: {
		static: path.join(__dirname, 'dist'),
		historyApiFallback: true,
		compress: true,
		open: true,
		port: 3000
	}
}
