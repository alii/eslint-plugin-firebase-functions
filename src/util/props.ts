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

	throw new Error('Root object is not an identifier');
}
