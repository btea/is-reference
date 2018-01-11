import { Node } from 'estree';

export default function isReference (node: Node, parent: Node): boolean {
	if (node.type === 'MemberExpression') {
		return !node.computed && isReference(node.object, node);
	}

	if (node.type === 'Identifier') {
		// the only time we could have an identifier node without a parent is
		// if it's the entire body of a function without a block statement –
		// i.e. an arrow function expression like `a => a`
		if (!parent) return true;

		if (parent.type === 'MemberExpression') return parent.computed || node === parent.object;
		if (parent.type === 'MethodDefinition') return parent.computed;

		// disregard the `bar` in `{ bar: foo }`, but keep it in `{ [bar]: foo }`
		if (parent.type === 'Property') return parent.computed || node === parent.value;

		// disregard the `bar` in `export { foo as bar }`
		if (parent.type === 'ExportSpecifier' && node !== parent.local) return false;

		return true;
	}

	return false;
}