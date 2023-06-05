import { TokenEntry } from './tokens.js'

export const error = (message: string, token: TokenEntry | number) => {
	throw new Error(`${message} at position ${typeof token === 'number' ? token : token.start}.`)
}
