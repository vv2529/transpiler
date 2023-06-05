import { BinaryOperator, VariableDeclarationKeyword } from './types.js'

export class AST {
	public type: string

	constructor(type: string) {
		this.type = type
	}

	toString() {
		return ''
	}
}

export class Program extends AST {
	public body: AST[]

	constructor(body: AST[] = []) {
		super('Program')
		this.body = body
	}

	toString() {
		return this.body.map((statement) => `${statement};`).join('\n')
	}
}

export abstract class Statement extends AST {}

export class VariableDeclaration extends Statement {
	public kind: VariableDeclarationKeyword
	public declarations: VariableDeclarator[]

	constructor(kind: VariableDeclarationKeyword, declarations: VariableDeclarator[]) {
		super('VariableDeclaration')
		this.kind = kind
		this.declarations = declarations
	}

	toString() {
		return `${this.kind} ${this.declarations.join(', ')}`
	}
}

export class VariableDeclarator extends AST {
	public id: Identifier
	public typeAnnotation?: string
	public init?: Expression

	constructor(id: Identifier, typeAnnotation?: string, init?: Expression) {
		super('VariableDeclarator')
		this.id = id
		this.typeAnnotation = typeAnnotation
		this.init = init
	}

	toString() {
		return `${this.id}${this.typeAnnotation ? `: ${this.typeAnnotation}` : ''}${
			this.init ? ` = ${this.init}` : ''
		}`
	}
}

export class Identifier extends AST {
	public name: string

	constructor(name: string) {
		super('Identifier')
		this.name = name
	}

	toString() {
		return this.name
	}
}

export abstract class Literal extends AST {}

export class NumericLiteral extends Literal {
	public value: string

	constructor(value: string) {
		super('NumericLiteral')
		this.value = value
	}

	toString() {
		return this.value
	}
}

export class StringLiteral extends Literal {
	public value: string

	constructor(value: string) {
		super('StringLiteral')
		this.value = value
	}

	toString() {
		return JSON.stringify(this.value)
	}
}

export abstract class Expression extends AST {}

export type Operand = Identifier | Literal | Expression
export type Callable = Identifier | MemberExpression

export abstract class GenericFunctionExpression extends AST {
	public params: VariableDeclarator[]
	public body: Expression

	constructor(type: string, params: VariableDeclarator[], body: Expression) {
		super(type)
		this.params = params
		this.body = body
	}
}

export class ArrowFunctionExpression extends GenericFunctionExpression {
	constructor(params: VariableDeclarator[], body: Expression) {
		super('ArrowFunctionExpression', params, body)
	}

	toString() {
		return `(${this.params.join(', ')}) => ${this.body}`
	}
}

export class FunctionExpression extends GenericFunctionExpression {
	constructor(params: VariableDeclarator[], body: Expression) {
		super('FunctionExpression', params, body)
	}

	toString() {
		return `function(${this.params.join(', ')}) ${this.body}`
	}
}

export class CallExpression extends Expression {
	public callee: Callable
	public args: Operand[]

	constructor(callee: Callable, args: Operand[]) {
		super('CallExpression')
		this.callee = callee
		this.args = args
	}

	toString() {
		return `${this.callee}(${this.args.join(', ')})`
	}
}

export class BinaryExpression extends Expression {
	public operator: BinaryOperator
	public left: Operand
	public right: Operand

	constructor(operator: BinaryOperator, left: Operand, right: Operand) {
		super('BinaryExpression')
		this.operator = operator
		this.left = left
		this.right = right
	}

	toString() {
		return `${this.left} ${this.operator} ${this.right}`
	}
}

export class MemberExpression extends Expression {
	public object: Identifier
	public property: Identifier

	constructor(object: Identifier, property: Identifier) {
		super('MemberExpression')
		this.object = object
		this.property = property
	}

	toString() {
		return `${this.object}.${this.property}`
	}
}

export class BlockStatement extends Statement {
	public body: Statement

	constructor(body: Statement) {
		super('BlockStatement')
		this.body = body
	}

	toString() {
		return `{ ${this.body}; }`
	}
}

export class ReturnStatement extends Statement {
	public argument: Expression

	constructor(argument: Expression) {
		super('ReturnStatement')
		this.argument = argument
	}

	toString() {
		return `return ${this.argument}`
	}
}
