import WebSocketMessager from "./server/WebSocketMessager";
export type Entity = number;
import DNDEntity from "./dnd/Entity";
// export type EntityComponent = DNDEntity;
interface Component {

}
export type Observer = (registry: Registry, id: Entity) => void;
export default class Registry {
	#entitySet: Set<Entity> = new Set();
	#entityIdCounter: Entity;
	#componentPools: Map<string, Map<Entity, Component>> = new Map();
	#updateAnyObservers: Set<Observer> = new Set();
	#updateObservers: Map<Entity, Set<Observer>> = new Map();
	#destroyObserversAny: Set<Observer> = new Set();
	#destroyObservers: Map<Entity, Set<Observer>> = new Map();
	constructor() {
		this.#entityIdCounter = 0;
	}
	toJson() {
		return JSON.stringify({
			entitySet: Array.from(this.#entitySet),
			entityIdCounter: this.#entityIdCounter,
			componentPools: Array.from(this.#componentPools.entries()).map(([typeName, pool]) => {
				return [typeName, Array.from(pool.entries())];
			}),
		});
	}
	fromJson(data: string) {
		const obj = JSON.parse(data);
		this.#entitySet = new Set(obj.entitySet);
		this.#entityIdCounter = obj.entityIdCounter;
		this.#componentPools = new Map(obj.componentPools.map(([typeName, pool]: [string, [Entity, Component][]]) => {
			return [typeName, new Map(pool)];
		}));
	}
	addOnUpdateAny(callback: Observer) {
		this.#updateAnyObservers.add(callback);
	}
	removeOnUpdateAny(callback: Observer) {
		this.#updateAnyObservers.delete(callback);
	}
	addOnUpdate(id: Entity, callback: Observer) {
		if (!this.#updateObservers.has(id)) {
			this.#updateObservers.set(id, new Set());
		}
		this.#updateObservers.get(id)?.add(callback);
	}
	removeOnUpdate(id: Entity, callback: Observer) {
		this.#updateObservers.get(id)?.delete(callback);
	}
	addOnDestroyAny(callback: Observer) {
		this.#destroyObserversAny.add(callback);
	}
	removeOnDestroyAny(callback: Observer) {
		this.#destroyObserversAny.delete(callback);
	}
	addOnDestroy(id: Entity, callback: Observer) {
		if (!this.#destroyObservers.has(id)) {
			this.#destroyObservers.set(id, new Set());
		}
		this.#destroyObservers.get(id)?.add(callback);
	}
	removeOnDestroy(id: Entity, callback: Observer) {
		this.#destroyObservers.get(id)?.delete(callback);
	}
	// #set(id: Entity, data: Component) {
	// 	const data2 = data === undefined ? {} : data;
	// 	this.#entitySet[id] = data2;
	// 	this.#updateAnyObservers.forEach((observer) => {
	// 		observer(this, id);
	// 	});
	// }
	create() {
		const id = this.#entityIdCounter++;
		this.#entitySet.add(id);
		// this.#set(id, new DNDEntity());
		return id;
	}
	get(typeName: string, id: Entity) {
		// return this.#entitySet[id];
		return this.#componentPools.get(typeName)?.get(id);
	}
	patch(id: Entity, data: Component) {
		// this.#set(id, data);
		const constructor = data.constructor;
		const typeName = constructor.name;
		this.#componentPools.get(typeName)?.set(id, data);
		this.#updateAnyObservers.forEach((observer) => {
			observer(this, id);
		});
	}
	destroy(id: Entity) {
		this.#destroyObserversAny.forEach((observer) => {
			observer(this, id);
		});
		this.#entitySet.delete(id);
	}
	each(typeName: string, callback: (id: Entity, data: Component) => void) {
		if (!this.#componentPools.has(typeName)) {
			return;
		}
		this.#componentPools.get(typeName)?.forEach((data, id) => {
			callback(id, data);
		});
	}
	map(typeName: string, callback: (id: Entity, data: Component) => any) {
		const result: any = [];
		this.each(typeName, (id, data) => {
			result.push(callback(id, data));
		});
		return result;
	}
}