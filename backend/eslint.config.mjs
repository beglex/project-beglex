import antfu from '@antfu/eslint-config';
import 'eslint-plugin-only-warn';

export default antfu({
    typescript: true,
    markdown: false,
    vue: false,

    rules: {
        'no-console': 'off',

        'antfu/consistent-list-newline': 'off',
        'antfu/top-level-function': 'off',

        'node/prefer-global/process': 'off',

        'perfectionist/sort-imports': ['error', {
            internalPattern: ['~/**', '@root/**'],
            groups: ['type', 'builtin', 'external', 'internal-type', 'internal', ['parent-type', 'sibling-type', 'index-type'], ['parent', 'sibling', 'index']], // eslint-disable-line style/max-len
        }],

        'style/block-spacing': 'off',
        'style/brace-style': ['error', '1tbs'],
        'style/indent': ['error', 4],
        'style/max-len': ['error', 120],
        'style/member-delimiter-style': ['error', {multiline: {delimiter: 'semi'}}],
        'style/object-curly-spacing': ['error', 'never'],
        'style/object-property-newline': ['error', {allowAllPropertiesOnSameLine: true}],
        'style/semi': ['error', 'always'],

        'test/prefer-lowercase-title': 'off',

        'ts/consistent-type-definitions': 'off',
        'ts/consistent-type-imports': 'off',

        'unicorn/catch-error-name': ['error', {name: 'err'}],
    },
});
