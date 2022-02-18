import {stripIndent} from 'common-tags';
import {RuleTester} from 'eslint';
import plugin from '../src';

import {INVALID_FUNCTION_EXPORT} from '../src/rules/safe-function-exports/errors';

const rules = new RuleTester({
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
});

const GOOD_CODE = stripIndent`
	import * as functions from "firebase-functions";

	export const goodHello = functions.https.onRequest((request, response) => {
		functions.logger.info("Hello logs!", {structuredData: true});
		response.send("Hello from Firebase!"); 
	});
`.trim();

const GOOD_CODE_CASES = [
	stripIndent`
	import * as functions from "firebase-functions";

	export const goodHello = functions.https.onRequest((request, response) => {
		functions.logger.info("Hello logs!", {structuredData: true});
		response.send("Hello from Firebase!"); 
	});
	`,
	stripIndent`
	import * as functions from "firebase-functions";

	export const goodHello = functions.region('europe-west1').https.onRequest((request, response) => {
		functions.logger.info("Hello logs!", {structuredData: true});
		response.send("Hello from Firebase!"); 
	});
	`,
	stripIndent`
	import * as functions from "firebase-functions";

	export const goodHello = functions.runWith({ timeoutSeconds: 10 }).https.onRequest((request, response) => {
		functions.logger.info("Hello logs!", {structuredData: true});
		response.send("Hello from Firebase!"); 
	});
	`,
	stripIndent`
	import * as functions from "firebase-functions";

	export const goodHello = functions.firestore.document('/orders/{orderId}')
  	.onWrite((snapshot, context) => {
		functions.logger.info("Hello logs!", {structuredData: true});
		response.send("Hello from Firebase!"); 
	});
	`,
	stripIndent`
	import * as functions from "firebase-functions";

	export const goodHello = functions.runWith({ timeoutSeconds: 10 }).firestore.document('/orders/{orderId}')
  	.onWrite((snapshot, context) => {
		functions.logger.info("Hello logs!", {structuredData: true});
		response.send("Hello from Firebase!"); 
	});
	`,
	stripIndent`
	import * as functions from "firebase-functions";

	export const goodHello = functions.runWith({ timeoutSeconds: 10 }).pubsub.schedule('every 5 minutes')
	.onRun(async () => {
		functions.logger.info("Hello logs!", {structuredData: true});
		response.send("Hello from Firebase!"); 
	});
	`
];

const BAD_CODE = GOOD_CODE.replace('export ', '');

rules.run('safe-function-exports', plugin.rules['safe-function-exports'], {
	valid: [
		{
			code: GOOD_CODE,
		},
	],
	invalid: [
		{
			code: BAD_CODE,
			output: GOOD_CODE,
			errors: [
				{
					message: INVALID_FUNCTION_EXPORT,
				},
			],
		},
	],
});
