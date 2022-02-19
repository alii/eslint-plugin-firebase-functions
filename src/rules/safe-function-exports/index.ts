import {Rule} from 'eslint';
import {ImportNamespaceSpecifier} from 'estree';
import {INVALID_FUNCTION_EXPORT} from './errors';

export interface SafeFunctionExportsOptions {
	importStarName: string;
}

export const safeFunctionExports: Rule.RuleModule = {
	create: context => {
		const {importStarName = 'functions'} = (context.options[0] ||
			{}) as Partial<SafeFunctionExportsOptions>;

		const hasFirebaseImports = context.getSourceCode().ast.body.some(node => {
			if (node.type === 'ImportDeclaration') {
				const namespaces = node.specifiers.filter(
					(specifier): specifier is ImportNamespaceSpecifier =>
						specifier.type === 'ImportNamespaceSpecifier',
				);

				if (namespaces.length === 0) {
					// No `import * as functions from 'firebase-functions'`, so this is not a "valid" firebase import and we can
					// ignore this file for linting
					return false;
				}

				return (
					node.source.type === 'Literal' &&
					node.source.value === 'firebase-functions' &&
					namespaces.some(namespace => namespace.local.name === importStarName)
				);
			}

			return false;
		});

		if (!hasFirebaseImports) {
			return {};
		}

		return {
			VariableDeclaration(node) {
				const isFirebaseFunction =
					node.kind === 'const' &&
					node.declarations.every(declaration => {
						return (
							declaration.init &&
							declaration.init.type === 'CallExpression' &&
							declaration.init.callee.type === 'MemberExpression' &&
							declaration.init.callee.object.type === 'MemberExpression' &&
							declaration.init.callee.object.object.type === 'Identifier' &&
							declaration.init.callee.object.object.name === importStarName
						);
					});

				if (!isFirebaseFunction) {
					return;
				}

				const isExported = node.parent.type === 'ExportNamedDeclaration';

				if (!isExported) {
					context.report({
						node,
						messageId: 'INVALID_FUNCTION_EXPORT',
						fix(fixer) {
							return [fixer.insertTextBefore(node, 'export ')];
						},
					});
				}
			},
		};
	},

	meta: {
		fixable: 'code',
		messages: {INVALID_FUNCTION_EXPORT},
	},
};
