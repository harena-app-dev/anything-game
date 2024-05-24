import WebSocketMessager from "./server/WebSocketMessager";
export type Entity = number;
export type EntityComponent = any;
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
		this.#entityMap = JSON.parse(data);
	}
	#updateObservers: Set<Observer> = new Set();
	addOnUpdate(callback: Observer) {
		this.#updateObservers.add(callback);
	}
	removeOnUpdate(callback: Observer) {
		this.#updateObservers.delete(callback);
	}
	#destroyObservers: Set<Observer> = new Set();
	addOnDestroy(callback: Observer) {
		this.#destroyObservers.add(callback);
	}
	removeOnDestroy(callback: Observer) {
		this.#destroyObservers.delete(callback);
	}
	set(id: Entity, data: EntityComponent) {
		const data2 = data === undefined ? {} : data;
		this.#entityMap[id] = data2;
		this.#updateObservers.forEach((observer) => {
			observer(this, id);
		});
	}
	create(data: EntityComponent) {
		const id = this.#entityIdCounter++;
		this.set(id, data);
		return id;
	}
	get(id: Entity) {
		return this.#entityMap[id];
	}
	patch(id: Entity, data: EntityComponent) {
		this.set(id, data);
	}
	destroy(id: Entity) {
		this.#destroyObservers.forEach((observer) => {
			observer(this, id);
		});
		this.#entityMap.delete(id);
	}
	each(callback: (id: Entity, data: EntityComponent) => void) {
		for (const id in this.#entityMap) {
			callback(Number(id), this.#entityMap[id]);
		}
	}
}