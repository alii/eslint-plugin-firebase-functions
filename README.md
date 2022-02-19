# eslint-plugin-firebase-functions

An eslint plugin that provides utilty rules for working with firebase functions.

### Install

```sh
yarn add eslint-plugin-firebase-functions --dev
```

And add the plugin to your `.eslintrc.js` and make sure you enable the rules you want to use:

```js
module.exports = {
	plugins: ['eslint-plugin-firebase-functions'],
	rules: {
		// Example enabling a rule
		'firebase-functions/<rule>': 'error',
	},
};
```

### Rules:

- `safe-function-exports`: Ensures that firebase functions defined in a file are exported inline as a named export
