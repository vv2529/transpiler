import { Program } from './nodes.js'

export const emit = (ast: Program): string => {
	return ast.toString()
}
