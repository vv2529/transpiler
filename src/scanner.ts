import { Token, TokenEntry, tokenRegexMap } from './tokens.js'
import { error } from './util.js'

export const scan = (inputText: string): TokenEntry[] => {
	const tokens: TokenEntry[] = []
	let index = 0

	while (index < inputText.length) {
		let foundToken: TokenEntry | undefined

		for (let [token, regex] of Object.entries(tokenRegexMap)) {
			const matches = inputText.slice(index).match(regex)

			if (matches && matches[0]) {
				foundToken = {
					start: index,
					end: index + matches[0].length,
					type: token as Token,
					value: matches[0],
				}

				index += matches[0].length
				tokens.push(foundToken)

				break
			}
		}

		if (!foundToken) {
			error('Could not find token', index)
		}
	}

	return tokens
}
