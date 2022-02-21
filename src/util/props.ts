import {Expression, Super} from 'estree';

export function getRootName(object: Expression | Super): string {
	if (object.type === 'MemberExpression') {
		return getRootName(object.object);
	}

	if (object.type === 'CallExpression') {
		return getRootName(object.callee);
	}

	if (object.type === 'Identifier') {
		return object.name;
	}

	if (object.type === 'AwaitExpression') {
		return getRootName(object.argument);
	}

	throw new Error('Root object is not an identifier');
}
