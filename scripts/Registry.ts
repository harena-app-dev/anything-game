import WebSocketMessager from "./server/WebSocketMessager";
export type Entity = number;
import DNDEntity from "./dnd/Entity";
// export type EntityComponent = DNDEntity;
// export type Observer = (registry: Registry, id: Entity) => void;
// export default class Registry {
// 	protected entitySet: Set<Entity> = new Set();
// 	protected entityIdCounter: Entity;
// 	protected typesToEntitiesToComponents: Map<string, Map<Entity, Component>> = new Map();
// 	protected updateAnyObservers: Set<Observer> = new Set();
// 	protected updateObservers: Map<Entity, Set<Observer>> = new Map();
// 	protected destroyObserversAny: Set<Observer> = new Set();
// 	protected destroyObservers: Map<Entity, Set<Observer>> = new Map();
// 	constructor() {
// 		this.entityIdCounter = 0;
// 	}
// 	toJson() {
// 		return JSON.stringify({
// 			entitySet: Array.from(this.entitySet),
// 			entityIdCounter: this.entityIdCounter,
// 			typesToEntitiesToComponents: Array.from(this.typesToEntitiesToComponents.entries()).map(([typeName, pool]) => {
// 				return [typeName, Array.from(pool.entries())];
// 			}),
// 		});
// 	}
// 	fromJson(data: string) {
// 		const obj = JSON.parse(data);
// 		this.entitySet = new Set(obj.entitySet);
// 		this.entityIdCounter = obj.entityIdCounter;
// 		this.typesToEntitiesToComponents = new Map(obj.typesToEntitiesToComponents.map(([typeName, pool]: [string, [Entity, Component][]]) => {
// 			return [typeName, new Map(pool)];
// 		}));
// 	}
// 	addOnUpdateAny(callback: Observer) {
// 		this.updateAnyObservers.add(callback);
// 	}
// 	removeOnUpdateAny(callback: Observer) {
// 		this.updateAnyObservers.delete(callback);
// 	}
// 	addOnUpdate(id: Entity, callback: Observer) {
// 		if (!this.updateObservers.has(id)) {
// 			this.updateObservers.set(id, new Set());
// 		}
// 		this.updateObservers.get(id)?.add(callback);
// 	}
// 	removeOnUpdate(id: Entity, callback: Observer) {
// 		this.updateObservers.get(id)?.delete(callback);
// 	}
// 	addOnDestroyAny(callback: Observer) {
// 		this.destroyObserversAny.add(callback);
// 	}
// 	removeOnDestroyAny(callback: Observer) {
// 		this.destroyObserversAny.delete(callback);
// 	}
// 	addOnDestroy(id: Entity, callback: Observer) {
// 		if (!this.destroyObservers.has(id)) {
// 			this.destroyObservers.set(id, new Set());
// 		}
// 		this.destroyObservers.get(id)?.add(callback);
// 	}
// 	removeOnDestroy(id: Entity, callback: Observer) {
// 		this.destroyObservers.get(id)?.delete(callback);
// 	}
// 	// #set(id: Entity, data: Component) {
// 	// 	const data2 = data === undefined ? {} : data;
// 	// 	this.#entitySet[id] = data2;
// 	// 	this.#updateAnyObservers.forEach((observer) => {
// 	// 		observer(this, id);
// 	// 	});
// 	// }
// 	create() {
// 		const id = this.entityIdCounter++;
// 		this.entitySet.add(id);
// 		// this.#set(id, new DNDEntity());
// 		return id;
// 	}
// 	get(typeName: string, id: Entity) {
// 		// return this.#entitySet[id];
// 		return this.typesToEntitiesToComponents.get(typeName)?.get(id);
// 	}
// 	// patch(id: Entity, data: Component) {
// 	patch(typeName: string, id: Entity, data: Component) {
// 		// this.#set(id, data);
// 		// const constructor = data.constructor;
// 		// const typeName = constructor.name;
// 		this.typesToEntitiesToComponents.get(typeName)?.set(id, data);
// 		this.updateAnyObservers.forEach((observer) => {
// 			observer(this, id);
// 		});
// 	}
// 	destroy(id: Entity) {
// 		this.destroyObserversAny.forEach((observer) => {
// 			observer(this, id);
// 		});
// 		this.entitySet.delete(id);
// 	}
// 	each(typeName: string, callback: (id: Entity, data: Component) => void) {
// 		if (!this.typesToEntitiesToComponents.has(typeName)) {
// 			return;
// 		}
// 		this.typesToEntitiesToComponents.get(typeName)?.forEach((data, id) => {
// 			callback(id, data);
// 		});
// 	}
// 	map(typeName: string, callback: (id: Entity, data: Component) => any) {
// 		const result: any = [];
// 		this.each(typeName, (id, data) => {
// 			result.push(callback(id, data));
// 		});
// 		return result;
// 	}
// }
