const stylelint = require('stylelint')
const deasync = require('deasync')

const helperMethods = ['keyframes', 'injectGlobal', 'css']

const isHelper = (node) => node.tag.type === 'Identifier' && helperMethods.includes(node.tag.name)

const isStyledTagname = (node) => node.tag.type === 'MemberExpression' && node.tag.object.name === 'styled' && node.tag.property.type === 'Identifier'

function lintAsync(options, callback) {
	stylelint.lint(options)
		.then(result => {
			callback(null, result)
		})
		.catch(error => {
			callback(error)
		})
}

const lint = deasync(lintAsync)

module.exports = {
	create(context) {
		const options = context.options[0]

		return {
			TaggedTemplateExpression(node) {
				if(isStyledTagname(node)) {
					try {
						lint({
							code: node.quasi.quasis[0].value.raw,
							config: options.stylelint,
						})
					} catch (error) {
						//
					}
				}
			}
		}
	},
}
