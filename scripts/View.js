import Log from './Log.js';
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
		this.each((entity) => {
			result.push(callback(entity));
		});
		return result;
	}
	if (types === undefined) {
		this._entities = this._entities;
		return v;
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