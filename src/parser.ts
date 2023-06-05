import {
	ArrowFunctionExpression,
	BinaryExpression,
	CallExpression,
	Expression,
	Identifier,
	NumericLiteral,
	Operand,
	Program,
	Statement,
	VariableDeclaration,
	VariableDeclarator,
} from './nodes.js'
import {
	isBinaryOperator,
	isDelimiter,
	isOperand,
	isTrivialToken,
	isTypeAnnotationKeyword,
	isVariableDeclarationKeyword,
	TokenEntry,
} from './tokens.js'
import { BinaryOperator, VariableDeclarationKeyword } from './types.js'
import { error } from './util.js'

export const parse = (tokens: TokenEntry[]): Program => {
	tokens = tokens.filter((token) => !isTrivialToken(token.type))

	const statements: Statement[] = []
	const ast = new Program(statements)
	const statementTokens: TokenEntry[][] = [[]]
	let statementIndex = 0

	tokens.forEach((token) => {
		if (isDelimiter(token.type)) {
			statementIndex++
			statementTokens[statementIndex] = []
		} else {
			statementTokens[statementIndex].push(token)
		}
	})

	statementTokens.forEach((tokens, index) => {
		let i = 0

		if (isVariableDeclarationKeyword(tokens[i]?.type)) {
			let keyword = tokens[i].value as VariableDeclarationKeyword
			let id: string = ''
			let typeAnnotation: string | undefined
			let init: Expression | undefined

			if (!tokens[i + 1] || tokens[i + 1].type !== 'Identifier')
				error('Identifier expected', tokens[i + 1])
			else id = tokens[i + 1].value

			if (tokens[i + 2]) {
				if (tokens[i + 2].type === 'ColonToken') {
					if (!isTypeAnnotationKeyword(tokens[i + 3]?.type))
						error('Type annotation expected', tokens[i + 3])
					typeAnnotation = tokens[i + 3].value
					i += 2
				}

				if (tokens[i + 2].type === 'EqualsToken') {
					const params: VariableDeclarator[] = []
					let id: string = ''
					let typeAnnotation: string | undefined

					if (tokens[i + 3]?.type !== 'OpenParenToken')
						error('Open parenthesis expected', tokens[i + 3])

					while (tokens[i + 4]?.type === 'Identifier') {
						id = tokens[i + 4].value

						if (tokens[i + 5]?.type === 'ColonToken') {
							if (!isTypeAnnotationKeyword(tokens[i + 6]?.type))
								error('Type annotation expected', tokens[i + 6])
							typeAnnotation = tokens[i + 6].value
							i += 2
						}

						params.push(new VariableDeclarator(new Identifier(id), typeAnnotation))
						i++
						if (tokens[i + 4]?.type === 'CommaToken') i++
					}

					if (tokens[i + 4]?.type !== 'CloseParenToken')
						error('Closing parenthesis expected', tokens[i + 4])
					if (tokens[i + 5]?.type !== 'EqualsGreaterThanToken')
						error('Arrow expected', tokens[i + 5])
					if (!isOperand(tokens[i + 6]?.type))
						error('Identifier or literal expected', tokens[i + 6])
					if (!isBinaryOperator(tokens[i + 7]?.type))
						error('Binary operator expected', tokens[i + 7])
					if (!isOperand(tokens[i + 8]?.type))
						error('Identifier or literal expected', tokens[i + 8])

					init = new ArrowFunctionExpression(
						params,
						new BinaryExpression(
							tokens[i + 7].value as BinaryOperator,
							tokens[i + 6].type === 'NumericLiteral'
								? new NumericLiteral(tokens[i + 6].value)
								: new Identifier(tokens[i + 6].value),
							tokens[i + 8].type === 'NumericLiteral'
								? new NumericLiteral(tokens[i + 8].value)
								: new Identifier(tokens[i + 8].value)
						)
					)
				}
			}

			statements[index] = new VariableDeclaration(keyword, [
				new VariableDeclarator(new Identifier(id), typeAnnotation, init),
			])
		} else if (tokens[i]?.type === 'Identifier') {
			const id = tokens[i].value

			if (tokens[i + 1]?.type === 'OpenParenToken') {
				const args: Operand[] = []

				while (isOperand(tokens[i + 2]?.type)) {
					args.push(
						tokens[i + 2].type === 'NumericLiteral'
							? new NumericLiteral(tokens[i + 2].value)
							: new Identifier(tokens[i + 2].value)
					)
					i++
					if (tokens[i + 2]?.type === 'CommaToken') i++
				}

				if (tokens[i + 2]?.type !== 'CloseParenToken')
					error('Closing parenthesis expected', tokens[i + 2])

				statements[index] = new CallExpression(new Identifier(id), args)
			} else if (!tokens[i + 1]) {
				statements[index] = new Identifier(id)
			} else {
				error('Unexpected token', tokens[i + 1])
			}
		}
	})

	return ast
}
