export const tokenRegexMap = {
	NewLineTrivia: /^\n+/,
	WhitespaceTrivia: /^\s+/,
	ConstKeyword: /^\bconst\b/,
	VarKeyword: /^\bvar\b/,
	FunctionKeyword: /^\bfunction\b/,
	ReturnKeyword: /^\breturn\b/,
	NumberKeyword: /^\bnumber\b/,
	Identifier: /^\b[a-zA-Z_$][0-9a-zA-Z_$]*\b/,
	NumericLiteral: /^\b(\d+\.\d+|\d+\.|\.\d+|\d+)\b/,
	StringLiteral: /^(".*"|'.*')/,
	OpenParenToken: /^\(/,
	CloseParenToken: /^\)/,
	OpenBraceToken: /^\{/,
	CloseBraceToken: /^\}/,
	DotToken: /^\./,
	ColonToken: /^:/,
	CommaToken: /^,/,
	SemicolonToken: /^;/,
	EqualsGreaterThanToken: /^=>/,
	EqualsToken: /^=/,
	AsteriskAsteriskToken: /^\*\*/,
}

export type Token = keyof typeof tokenRegexMap

export type TokenEntry = {
	start: number
	end: number
	type: Token
	value: string
}

const trivialTokens: Token[] = ['WhitespaceTrivia']
const delimiters: Token[] = ['NewLineTrivia', 'SemicolonToken']
const variableDeclarationKeywords: Token[] = ['ConstKeyword', 'VarKeyword']
const typeAnnotationKeywords: Token[] = ['NumberKeyword']
const binaryOperators: Token[] = ['AsteriskAsteriskToken']
const operands: Token[] = ['Identifier', 'NumericLiteral']

export const isTrivialToken = (token: Token) => trivialTokens.includes(token)
export const isDelimiter = (token: Token) => delimiters.includes(token)
export const isVariableDeclarationKeyword = (token: Token) =>
	variableDeclarationKeywords.includes(token)
export const isTypeAnnotationKeyword = (token: Token) => typeAnnotationKeywords.includes(token)
export const isBinaryOperator = (token: Token) => binaryOperators.includes(token)
export const isOperand = (token: Token) => operands.includes(token)
