export default  {
	debug(...args) {
		// console.debug(...args)
		// console.trace()
	},
	info(...args) {
		console.debug(...args)
	},
	warn(...args) {
		console.warn(...args)
	},
	error(...args) {
		console.error(...args)
		console.trace()
	}
}