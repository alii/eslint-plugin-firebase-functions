# eslint-plugin-firebase-functions

An eslint plugin that provides utilty rules for working with firebase functions.

### Install

```sh
yarn add eslint-plugin-firebase-functions --dev
```

And add the plugin to your `.eslintrc.js` and make sure you enable the rules you want to use:

```js
module.exports = {
	plugins: ['firebase-functions'],
	rules: {
		// Example enabling a rule
		'firebase-functions/<rule>': 'error',
	},
};
```

### Rules:

<details>
<summary>
<code>safe-function-exports</code> —
Ensures that firebase functions defined in a file are exported inline as a named export
</summary>

```ts
import * as functions from 'firebase-functions';

/////////////////////
// Incorrect usage //
/////////////////////

const bad = functions
	.runWith({timeoutSeconds: 2000})
	.https.onRequest((req, res) => {
		//
	});

const bad2 = functions.https.onRequest((req, res) => {
	//
});

// Fails because not inline
export {bad};

///////////////////
// Correct usage //
///////////////////

export const good = functions
	.runWith({timeoutSeconds: 2000})
	.https.onRequest((req, res) => {
		//
	});

export const good2 = functions.https.onRequest((req, res) => {
	//
});
```

</details>
