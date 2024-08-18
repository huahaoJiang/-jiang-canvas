module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
    'vue/setup-compiler-macros': true
  },
  extends: ['./eslintrc-auto-import.json', 'eslint:recommended', 'plugin:vue/vue3-recommended', 'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'esnext',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
    ecmaFeatures: {
      jsx: true
    },
    extraFileExtensions: ['.vue']
  },
  plugins: ['prettier', 'simple-import-sort'],
  rules: {
    // 开启 prettier 自动修复的功能
    'prettier/prettier': ['error'],
    indent: ['error', 2],
    'linebreak-style': 'off',
    quotes: ['error', 'single'],

    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    'vue/valid-template-root': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/multi-word-component-names': [
      'warn',
      {
        ignores: ['index', '401', '403', '404', '500']
      }
    ],
    'vue/attribute-hyphenation': 'off',
    'vue/valid-v-for': 'warn',
    'vue/require-v-for-key': 'warn',

    'no-var': 'error',
    // https://github.com/typescript-eslint/typescript-eslint/issues/2528
    'no-undef': 'off',
    // "max-depth": ["error", 2],

    // https://eslint.org/docs/rules/no-unused-vars#options
    '@typescript-eslint/no-unused-vars': 'error',
    // 对于类型导入统一使用 import type
    '@typescript-eslint/consistent-type-imports': 'error',
    // 统一使用 as 做类型断言（或常量断言） 而不是 <> <>断言再tsx中有问题
    '@typescript-eslint/consistent-type-assertions': 'warn',
    // 遍历数组时，让不需要index 建议 使用 for of 遍历
    '@typescript-eslint/prefer-for-of': 'warn',
    // 使用 ?. 而不是 &&
    '@typescript-eslint/prefer-optional-chain': 'error',
    // 统一使用T[]
    '@typescript-eslint/array-type': 'warn',

    /**
     * 需要描述为什么这里使用了 @ts 指令
     * 目前 @ts-ignore、@ts-nocheck、@ts-expect-error 均需要在提供描述的情况下使用
     * 如：// @ts-ignore: 这里的类型确实判断不出来...
     */
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': 'allow-with-description'
      }
    ],
    /**
     * 不允许使用 Function 与 {} 来作为类型标注
     * 对于 Function：你应该提供详细的参数、返回值结构
     * 对于 {}：任何数组类型都能 extends {}，甚至 number 都行
     * fixable
     */
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          Function: {
            message: 'Donot use Function as type!',
            fixWith: '(...args: any[]) => any'
          },
          '{}': {
            message: 'Donot use empty object as type!',
            fixWith: 'Record<string, any>'
          },
          Object: {
            message: 'Donot use top-level Object as type!',
            fixWith: 'Record<string, any>'
          },
          object: {
            message: 'Donot use object as type!',
            fixWith: 'Record<string, any>'
          }
        }
      }
    ],
    // 不要使用 foo.bar! ?? baz 这种形式，这样使用 ?? 就没有意义了
    '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
    // 不允许定义空的接口，允许单继承下的空接口
    '@typescript-eslint/no-empty-interface': 'warn',
    // 能够推导的类型不需要手动声明，但在函数参数、类属性中允许
    '@typescript-eslint/no-inferrable-types': [
      'error',
      {
        ignoreParameters: true,
        ignoreProperties: true
      }
    ],

    // 不允许显示any 忽略rest参数数组
    '@typescript-eslint/no-explicit-any': [
      'off',
      {
        fixToUnknown: false,
        ignoreRestArgs: true
      }
    ]
    // 不允许 throw 一个字符串，如 throw 'error'!
    // "no-throw-literal": "off",
    // "@typescript-eslint/no-throw-literal": "error"
    /**
     * 不需要使用不必要的类型参数，如泛型已经有默认值，还传入与默认值相同的泛型参数
     * function f<T = number>() {}
     * f<number>();
     * fixable
     */
    // "@typescript-eslint/no-unnecessary-type-arguments": "error",
    // 不需要不必要的类型断言：const a:string = 'foo' as string;
    // fixable
    // "@typescript-eslint/no-unnecessary-type-assertion": "error",
    // 对于 string | undefined 这种，使用非空断言而不是 as string
    // "@typescript-eslint/non-nullable-type-assertion-style": "error"
  }
}
