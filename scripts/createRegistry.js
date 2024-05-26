// import fs from 'fs';
// import path from 'path';
import * as Components from './components/index.js';
export function createObservable() {
	return {
		observers: new Set(),
		connect(callback) {
			this.observers.add(callback);
		},
		disconnect(callback) {
			this.observers.delete(callback);
		},
		notify(args) {
			this.observers.forEach(callback => callback(args));
		}
	}
}
export function createRegistry() {
	const registry = {
		entitySet: {},
		entityIdCounter: 0,
		typesToEntitiesToComponents: {},
		entitiesToTypes: {},
		onCreate: createObservable(),
		unsynced: new Set(['onCreate']),
		size() {
			return Object.keys(this.entitySet).length;
		},
		getTypes({ entity }) {
			return this.entitiesToTypes[entity];
		},
		getSingleton({ type }) {
			const entities = this.typesToEntitiesToComponents[type];
			if (entities === undefined) {
				console.error(`no entities of type ${type}`);
			}
			if (Object.keys(entities).length !== 1) {
				console.error(`expected exactly one entity of type ${type}`);
			}
			const entity = Object.keys(entities)[0];
			return this.get({ type, entity });
		},
		create() {
			const entity = this.entityIdCounter++;
			this.entitySet[entity] = {};
			this.entitiesToTypes[entity] = [];
			this.onCreate.notify({ entity });
			return entity;
		},
		emplace({ type, entity, component }) {
			if (!this.typesToEntitiesToComponents[type]) {
				this.typesToEntitiesToComponents[type] = {};
			}
			this.typesToEntitiesToComponents[type][entity] = component;
			this.entitiesToTypes[entity].push(type);
			return component;
		},
		destroy({ entity }) {
			delete this.entitySet[entity];
		},
		has({ type, entity }) {
			return this.typesToEntitiesToComponents[type] !== undefined && this.typesToEntitiesToComponents[type][entity] !== undefined;
		},
		get({ type, entity }) {
			return this.typesToEntitiesToComponents[type][entity];
		},
		each({ types, callback }) {
			if (types === undefined) {
				for (let entity in this.entitySet) {
					callback({ entity });
				}
				return;
			}
			// find the intersection of the entity sets
			const entitySets = types.map(type => this.typesToEntitiesToComponents[type]);
			const intersection = Object.keys(entitySets[0]);
			for (let i = 1; i < entitySets.length; i++) {
				const entitySet = entitySets[i];
				for (let entity in intersection) {
					if (entitySet[entity] === undefined) {
						delete intersection[entity];
					}
				}
			}
			for (let entity in intersection) {
				callback({ entity });
			}
		},
		map({ types, callback }) {
			const result = [];
			this.each({
				types, callback: ({ entity }) => {
					result.push(callback({ entity }));
				}
			});
			return result;
		}
	};
	const registeredComponents = {
		components: []
	};
	for (let [name, component] of Object.entries(Components)) {
		registeredComponents.components.push(name);
	}
	registry.emplace({ type: `RegisteredComponents`, entity: registry.create(), component: registeredComponents });
	return registry;
}