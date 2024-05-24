import WebSocketMessager from "./server/WebSocketMessager";
export type Entity = number;
import DNDEntity from "./dnd/Entity";
export type EntityComponent = DNDEntity;
export type Observer = (registry: Registry, id: Entity) => void;
export default class Registry {
	#entityMap: any;
	#entityIdCounter: Entity;
	constructor() {
		this.#entityMap = {};
		this.#entityIdCounter = 0;
	}
	toJson() {
		return JSON.stringify(this.#entityMap);
	}
	fromJson(data: string) {
		const entityMap = JSON.parse(data);
		for (const id in entityMap) {
			this.#set(Number(id), entityMap[id]);
		}
	}
	#updateAnyObservers: Set<Observer> = new Set();
	addOnUpdateAny(callback: Observer) {
		this.#updateAnyObservers.add(callback);
	}
	removeOnUpdateAny(callback: Observer) {
		this.#updateAnyObservers.delete(callback);
	}
	#updateObservers: Map<Entity, Set<Observer>> = new Map();
	addOnUpdate(id: Entity, callback: Observer) {
		if (!this.#updateObservers.has(id)) {
			this.#updateObservers.set(id, new Set());
		}
		this.#updateObservers.get(id)?.add(callback);
	}
	removeOnUpdate(id: Entity, callback: Observer) {
		this.#updateObservers.get(id)?.delete(callback);
	}
	#destroyObserversAny: Set<Observer> = new Set();
	addOnDestroyAny(callback: Observer) {
		this.#destroyObserversAny.add(callback);
	}
	removeOnDestroyAny(callback: Observer) {
		this.#destroyObserversAny.delete(callback);
	}
	#destroyObservers: Map<Entity, Set<Observer>> = new Map();
	addOnDestroy(id: Entity, callback: Observer) {
		if (!this.#destroyObservers.has(id)) {
			this.#destroyObservers.set(id, new Set());
		}
		this.#destroyObservers.get(id)?.add(callback);
	}
	removeOnDestroy(id: Entity, callback: Observer) {
		this.#destroyObservers.get(id)?.delete(callback);
	}
	#set(id: Entity, data: EntityComponent) {
		const data2 = data === undefined ? {} : data;
		this.#entityMap[id] = data2;
		this.#updateAnyObservers.forEach((observer) => {
			observer(this, id);
		});
	}
	create() {
		const id = this.#entityIdCounter++;
		this.#set(id, new DNDEntity());
		return id;
	}
	get(id: Entity) {
		return this.#entityMap[id];
	}
	patch(id: Entity, data: EntityComponent) {
		this.#set(id, data);
	}
	destroy(id: Entity) {
		this.#destroyObserversAny.forEach((observer) => {
			observer(this, id);
		});
		this.#entityMap.delete(id);
	}
	each(callback: (id: Entity, data: EntityComponent) => void) {
		for (const id in this.#entityMap) {
			callback(Number(id), this.#entityMap[id]);
		}
	}
	map(callback: (id: Entity, data: EntityComponent) => EntityComponent) {
		const result: any = [];
		this.each((id, data) => {
			result.push(callback(id, data));
		});
		return result;
	}
}