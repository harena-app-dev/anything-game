// import fs from 'fs';
// import path from 'path';
import Log from './Log';
import View from './View';
import * as Components from './components/index.auto.js';
import Observable from './Observable';
import { arrayRemove } from './Utils';
export function assert(condition, message) {
	if (!condition) {
		Log.error(message);
	}
}
export default function Registry() {
	const registry = {
		entitySet: [],
		destroyedSet: [],
		typesToEntitiesToComponents: {},
		typesToConstructors: {},
		entitiesToTypes: {},
		size() {
			return this.entitySet.length;
		},
		getTypes(entity) {
			return this.entitiesToTypes[entity];
		},
		create() {
			let entity;
			if (this.destroyedSet.length > 0) {
				entity = this.destroyedSet.pop();
			} else {
				entity = this.entitySet.length;
			}
			this.entitySet.push(entity);
			this.entitiesToTypes[entity] = [];
			this.onCreate().notify(entity);
			Log.debug(`create ${entity}`);
			return entity;
		},
		emplace(type, entity, component) {
			Log.debug(`emplace`, type, entity, component);
			if (!this.valid(entity)) {
				Log.error(`Entity ${entity} does not exist`);
				return;
			}
			if (this.entitiesToTypes[entity].includes(type)) {
				Log.error(`Entity ${entity} already has component of type ${type}`);
				return;
			}
			if (component === undefined) {
				if (!(this.typesToConstructors[type] instanceof Function)) {
					component = structuredClone(this.typesToConstructors[type]);
				} else {
					component = this.typesToConstructors[type]();
				}
			}
			this.getPool(type)[entity] = component;
			this.entitiesToTypes[entity].push(type);
			this.onEmplace(type).notify(entity, component)
			this.onEmplace().notify(type, entity, component);
			return component;
		},
		getOrEmplace(type, entity, component) {
			if (!this.has(type, entity)) {
				this.emplace(type, entity, component);
			}
			return this.get(type, entity);
		},
		emplaceOrReplace(type, entity, component) {
			if (!this.has(type, entity)) {
				this.emplace(type, entity, component);
			} else {
				this.replace(type, entity, component);
			}
		},
		erase(type, entity) {
			if (!this.has(type, entity)) {
				Log.error(`Entity ${entity} does not have component of type ${type}`);
			}
			const component = this.get(type, entity);
			this.onErase().notify(type, entity, component);
			this.onErase(type).notify(entity, component);
			delete this.getPool(type)[entity];
			const index = this.entitiesToTypes[entity].indexOf(type);
			this.entitiesToTypes[entity].splice(index, 1);
		},
		destroy(entity) {
			if (!this.valid(entity)) {
				Log.error(`Entity ${entity} does not exist`);
			}
			Log.debug(`this.entitiesToTypes[entity] ${JSON.stringify(this.entitiesToTypes[entity], null, 2)}`);
			for (let type of this.entitiesToTypes[entity].slice()) {
				Log.debug(`destroy ${type} ${entity}`);
				this.erase(type, entity);
			}
			this.onDestroy().notify(entity);
			const index = this.entitySet.indexOf(entity);
			this.entitySet.splice(index, 1);
			this.destroyedSet.push(entity);
			delete this.entitiesToTypes[entity];

		},
		has(type, entity) {
			return this.getPool(type)[entity] !== undefined;
		},
		getPool(type) {
			if (this.typesToEntitiesToComponents[type] === undefined) {
				this.typesToEntitiesToComponents[type] = {};
			}
			return this.typesToEntitiesToComponents[type];
		},
		get(type, entity) {
			return this.getPool(type)[entity];
		},
		valid(entity) {
			return this.entitySet.includes(entity);
		},
		replace(type, entity, component) {
			if (!this.has(type, entity)) {
				Log.error(`Entity ${entity} does not have component of type ${type}`);
				return;
			}
			this.getPool(type)[entity] = component;
			this.onUpdate().notify(type, entity, component);
			this.onUpdate(type).notify(entity, component);
			const component1 = this.get(type, entity);
			Log.debug(`component1 ${JSON.stringify(component1, null, 2)}`);
		},
		getEntities() {
			return this.entitySet.slice();
		},
		view(...types) {
			return new View(this, ...types);
		},
		toJson() {
			const obj = {
				entitySet: this.entitySet,
				typesToEntitiesToComponents: this.typesToEntitiesToComponents,
				entitiesToTypes: this.entitiesToTypes,
				destroyedSet: this.destroyedSet,
			};
			return JSON.stringify(obj);
		},
		fromJson(json) {
			try {
				const obj = JSON.parse(json);
				Log.debug(`fromJson ${JSON.stringify(obj, null, 2)}`);
				this.entitySet = obj.entitySet;
				this.typesToEntitiesToComponents = obj.typesToEntitiesToComponents;
				this.entitiesToTypes = obj.entitiesToTypes;
				this.destroyedSet = obj.destroyedSet;
			}
			catch (e) {
				Log.error(e, `fromJson ${json}`);
			}
		},
		observables: {
			onCreate: Observable(),
			onDestroy: Observable(),
			onEmplace: Observable(),
			onUpdate: Observable(),
			onErase: Observable(),
		},

		each(callback) {
			Log.debug(`each ${this.entitySet.length}`);
			this.view().each(callback);
		},
		map(callback) {
			return this.view().map(callback);
		}
	};
	registry.onCreate = function () {
		return registry.observables["onCreate"];
	}
	// registry.onEmplace = function ({ type } = {}) {
	registry.onEmplace = function (type) {
		if (type === undefined) {
			return registry.observables["onEmplace"];
		}
		return registry.observables[`onEmplace${type}`];
	}
	// registry.onUpdate = function ({ type } = {}) {
	registry.onUpdate = function (type) {
		if (type === undefined) {
			return registry.observables["onUpdate"];
		}
		return registry.observables[`onUpdate${type}`];
	}
	// registry.onErase = function ({ type } = {}) {
	registry.onErase = function (type) {
		if (type === undefined) {
			return registry.observables["onErase"];
		}
		return registry.observables[`onErase${type}`];
	}
	registry.onDestroy = function () {
		return registry.observables["onDestroy"];
	}
	for (let [type, constructor] of Object.entries(Components)) {
		registry.typesToConstructors[type] = constructor;
		registry.observables[`onEmplace${type}`] = Observable();
		registry.observables[`onUpdate${type}`] = Observable();
		registry.observables[`onErase${type}`] = Observable();
	}
	return registry;
}