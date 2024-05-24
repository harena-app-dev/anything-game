import WebSocketMessager from "./server/WebSocketMessager";
export type Entity = number;
export type EntityComponent = any;
export default class Registry {
	#entityMap: any;
	#entityIdCounter: Entity;
	constructor() {
		this.#entityMap = {};
		this.#entityIdCounter = 0;
	}
	toJson() {
		for (const id in this.#entityMap) {
			console.log('id', id);
			console.log('data', this.#entityMap[id]);
		}
		console.log('toJson', JSON.stringify(this.#entityMap));
		console.log('entityIdCounter', this.#entityIdCounter);
		return JSON.stringify(this.#entityMap);
	}
	fromJson(data: string) {
		console.log('fromJson', data);
		this.#entityMap = JSON.parse(data);
	}
	set(id: Entity, data: EntityComponent) {
		const data2 = data === undefined ? {} : data;
		this.#entityMap[id] = data2;
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
		this.#entityMap.delete(id);
	}
	each(callback: (id: Entity, data: EntityComponent) => void) {
		for (const id in this.#entityMap) {
			callback(Number(id), this.#entityMap[id]);
		}
	}
}