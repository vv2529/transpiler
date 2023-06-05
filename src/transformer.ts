import {
	ArrowFunctionExpression,
	AST,
	BinaryExpression,
	BlockStatement,
	CallExpression,
	FunctionExpression,
	GenericFunctionExpression,
	Identifier,
	MemberExpression,
	Program,
	ReturnStatement,
	StringLiteral,
	VariableDeclaration,
	VariableDeclarator,
} from './nodes.js'

export const transform = (ast: Program): void => {
	ast.body.map(transformOne)

	if (!(ast.body[0] instanceof StringLiteral && ast.body[0].value === 'use strict')) {
		ast.body.unshift(new StringLiteral('use strict'))
	}
}

const transformOne = (statement: AST): AST => {
	if (statement instanceof VariableDeclaration) {
		if (statement.kind !== 'var') statement.kind = 'var'
		statement.declarations.map(transformOne)
	} else if (statement instanceof VariableDeclarator) {
		if (statement.typeAnnotation) delete statement.typeAnnotation
		if (statement.init) statement.init = transformOne(statement.init)
	} else if (statement instanceof GenericFunctionExpression) {
		statement.params.map(transformOne)

		if (!(statement.body instanceof BlockStatement))
			statement.body = new BlockStatement(new ReturnStatement(statement.body))

		if (statement.body instanceof BlockStatement)
			if (statement.body.body instanceof ReturnStatement)
				statement.body.body.argument = transformOne(statement.body.body.argument)

		if (statement instanceof ArrowFunctionExpression)
			statement = new FunctionExpression(statement.params, statement.body)
	} else if (statement instanceof BinaryExpression) {
		statement.left = transformOne(statement.left)
		statement.right = transformOne(statement.right)

		if (statement.operator === '**')
			statement = new CallExpression(
				new MemberExpression(new Identifier('Math'), new Identifier('pow')),
				[statement.left, statement.right]
			)
	} else if (statement instanceof CallExpression) {
		statement.args.map(transformOne)
	}

	return statement
}
