// TODO: npx husky add .husky/pre-push "yarn test"

module.exports = {
	env: {
		browser: true,
		es2021: true,
		jest: true
	},
	extends: ['plugin:react/recommended', 'standard', 'eslint-config-prettier'],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	plugins: ['react', 'simple-import-sort'],
	rules: {
		'react/prop-types': ['off'],
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error'
	},
	overrides: [
		{
			files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
			rules: {
				'simple-import-sort/imports': [
					'error',
					{
						groups: [
							// `react` first, `next` second, then packages starting with a character
							['^react$', '^next', '^[a-z]'],
							// Packages starting with `@`
							['^@'],
							// Packages starting with `~`
							['^~'],
							// Imports starting with `../`
							['^\\.\\.(?!/?$)', '^\\.\\./?$'],
							// Imports starting with `./`
							['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
							// Style imports
							['^.+\\.s?css$'],
							// Side effect imports
							['^\\u0000']
						]
					}
				]
			}
		}
	]
}
