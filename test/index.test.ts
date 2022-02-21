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
	`,
	stripIndent`
		import * as functions from "firebase-functions";

		export const goodHello = functions.https.onRequest(async (request, response) => {
			const thing = "a string thing";
			functions.logger.info(thing, {structuredData: true});
			response.send("Hello from Firebase!"); 
		});
	`,
	stripIndent`
		import * as functions from "firebase-functions";

		const necessaryToReproduceBug = Promise.resolve([
		  {
		    doSomething(i) {
		      return new Promise((resolve) => setTimeout(() => resolve(i), 0));
		    },
		  },
		]);

		export const goodHello = functions.https.onRequest(async (request) => {
		  const messageId = (await necessaryToReproduceBug)[0].doSomething(1);
		  console.log('Message published.', messageId);
		});
	`,
];

const BAD_CODE_CASES = GOOD_CODE_CASES.map(code => code.replace('export ', ''));

rules.run('safe-function-exports', plugin.rules['safe-function-exports'], {
	valid: GOOD_CODE_CASES.map(code => ({code})),

	invalid: BAD_CODE_CASES.map((code, index) => ({
		code,
		output: GOOD_CODE_CASES[index],
		errors: [
			{
				message: INVALID_FUNCTION_EXPORT,
			},
		],
	})),
});
