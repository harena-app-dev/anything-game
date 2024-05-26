export function Components() {
	return {
		components: []
	};
}
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
	return {
		entitySet: {},
		entityIdCounter: 0,
		typesToEntitiesToComponents: {},
		entitiesToTypes: {},
		onCreate: createObservable(),
		unsynced: new Set([ 'onCreate' ]),
		size() {
			return Object.keys(this.entitySet).length;
		},
		create() {
			const entity = this.entityIdCounter++;
			this.entitySet[entity] = {};
			this.entitiesToTypes[entity] = [];
			this.onCreate.notify({entity});
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
		destroy({entity}) {
			delete this.entitySet[entity];
		},
		has({ type, entity }) {
			return this.typesToEntitiesToComponents[type] !== undefined && this.typesToEntitiesToComponents[type][entity] !== undefined;
		},
		get({ type, entity }) {
			return this.typesToEntitiesToComponents[type][entity];
		},
		each({ types, callback }) {
			if (types===undefined) {
				for (let entity in this.entitySet) {
					callback({entity});
				}
			}
		},
		map({ types, callback }) {
			const result = [];
			this.each({ types, callback: ({entity}) => {
				result.push(callback({entity}));
			}});
			return result;
		}
	};
}