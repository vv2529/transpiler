import { promises as fs } from 'fs'
import { transpile } from './program.js'

const main = async () => {
	const tsCode = await fs.readFile('example/index.ts', 'utf-8')

	const startTime = performance.now()
	const jsCode = transpile(tsCode)
	const endTime = performance.now()

	console.log(`Done in ${endTime - startTime}ms`)
	await fs.writeFile('example/index.js', jsCode)
}

main()
