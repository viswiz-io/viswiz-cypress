module.exports = {
	env: {
		es6: true,
		node: true,
		jest: true,
	},
	extends: ['eslint:recommended', 'prettier', 'plugin:@typescript-eslint/recommended'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: ['./tsconfig.json'],
		sourceType: 'module',
		tsconfigRootDir: '.',
	},
	rules: {
		'@typescript-eslint/ban-ts-comment': [
			'error',
			{
				'ts-check': true,
				'ts-expect-error': false,
				'ts-ignore': true,
				'ts-nocheck': true,
			},
		],
		indent: ['error', 'tab'],
	},
};
