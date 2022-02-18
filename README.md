# eslint-plugin-firebase-functions

An eslint plugin that provides utilty rules for working with firebase functions.

### Install

```sh
yarn add eslint-plugin-firebase-functions --dev
```

And add the plugin to your `.eslintrc.js`:

```js
module.exports = {
	plugins: ['eslint-plugin-firebase-functions'],
};
```

### Rules:

- `safe-function-exports`: Ensures that firebase functions defined in a file are exported inline as a named export
