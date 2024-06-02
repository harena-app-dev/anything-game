export function arrayRemove(arr, value) {
	var index = arr.indexOf(value);
	if (index > -1) {
		arr.splice(index, 1);
	}
	return arr;
}
export function offsetPortOfCurrentUrl(offset) {
	const currentUrl = window.location.href.split('/')
	const address = currentUrl[2].split(':')
	const port = address.length > 1 ? Number(address[1]) : 80
	const protocol = currentUrl[0] === 'http:' ? 'http' : 'https'
	return `${protocol}://${address[0]}:${port + offset}`
}
export function getParameterNames(func) {
	// Convert the function to a string
	const funcStr = func.toString();

	// Use a regular expression to extract the parameter list
	const paramStr = funcStr.match(/\(([^)]*)\)/)[1];

	// Split the parameters by comma and remove any extra whitespace
	const params = paramStr.split(',').map(param => param.trim());

	// Return the parameter names as an array
	return params;
}