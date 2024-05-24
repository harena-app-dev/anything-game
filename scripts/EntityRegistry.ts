import WebSocketMessager from "./server/WebSocketMessager";
export type Entity = number;
export type Component = any;
export default class EntityRegistry {
	#entityMap: any;
	#entityIdCounter: Entity;
	constructor() {
		this.#entityMap = new Map();
		this.#entityIdCounter = 0;
	}
	toJson() {
		return JSON.stringify(this.#entityMap);
	}
	fromJson(data: string) {
		console.log('fromJson', data);
		this.#entityMap = JSON.parse(data);
	}
	set(id: Entity, data: Component) {
		this.#entityMap[id] = data;
	}
	create(data: Component) {
		const id = this.#entityIdCounter++;
		this.set(id, data);
		return id;
	}
	get(id: Entity) {
		return this.#entityMap[id];
	}
	patch(id: Entity, data: Component) {
		this.set(id, data);
	}
	destroy(id: Entity) {
		this.#entityMap.delete(id);
	}
	each(callback: (id: Entity, data: Component) => void) {
		for (const id in this.#entityMap) {
			callback(Number(id), this.#entityMap[id]);
		}
	}
}