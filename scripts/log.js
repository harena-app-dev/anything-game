export default  {
	debug(...args) {
		// console.debug(...args)
		// console.trace()
	},
	info(...args) {
		console.info(...args)
	},
	warn(...args) {
		console.warn(...args)
		console.trace()
	},
	error(...args) {
		console.error(...args)
		console.trace()
	}
}