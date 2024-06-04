import Log from './log.js';
export default function (registry, ...types) {
	Log.debug(`View`, types);
	this._entities = []
	this._types = types
	this._registry = registry
	this.size = function () {
		return this._entities.length
	}
	this.each = function (callback) {
		for (let entity of this._entities) {
			callback(entity, ...types.map(type => registry.get(type, entity)));
		}
	}
	this.map = function (callback) {
		const result = [];
		this.each((...args) => {
			result.push(callback(...args));
		});
		return result;
	}
	if (types.length === 0) {
		this._entities = registry.getEntities();
		return this;
	}
	const pools = types.map(type => registry.getPool(type));
	this._entities = Object.keys(pools[0]);
	for (let i = 1; i < pools.length; i++) {
		const pool = pools[i];
		for (let entity of this._entities) {
			if (pool[entity] === undefined) {
				arrayRemove(this._entities, entity);
			}
		}
	}
	return this;
}