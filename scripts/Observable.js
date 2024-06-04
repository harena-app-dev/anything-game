import Log from './log';
export default function () {
	return {
		observers: new Set(),
		connect(callback) {
			this.observers.add(callback);
			return this
		},
		disconnect(callback) {
			this.observers.delete(callback);
		},
		notify(...args) {
			this.observers.forEach(callback => callback(...args));
		}
	}
}
export function addFunctionObservables({ parent, name }) {
	// add pre and post observables	
	const preObservable = Observable();
	const postObservable = Observable();
	const f = parent[name];
	parent[name] = (...args) => {
		preObservable.notify({ args });
		const result = f(...args);
		postObservable.notify({ args, result });
		return result;
	};
	parent[`onPre${name[0].toUpperCase()}${name.slice(1)}`] = preObservable;
	parent[`onPost${name[0].toUpperCase()}${name.slice(1)}`] = postObservable;
}