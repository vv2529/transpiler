import { emit } from './emitter.js'
import { parse } from './parser.js'
import { scan } from './scanner.js'
import { transform } from './transformer.js'

export const transpile = (inputText: string, noComments = false): string => {
	if (!noComments) console.log('Input program:\n', inputText)

	const tokens = scan(inputText)
	if (!noComments) console.log('Tokens:', tokens)

	const ast = parse(tokens)
	if (!noComments) console.log('AST:', JSON.stringify(ast, null, 2))

	transform(ast)
	if (!noComments) console.log('Transformed AST:', JSON.stringify(ast, null, 2))

	const outputText = emit(ast)
	if (!noComments) console.log('Transpiled program:\n', outputText)

	return outputText
}
