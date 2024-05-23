import WebSocketMessager from "./server/WebSocketMessager";

export default class EntityRegistry {
	#entityMap: any;
	#entityIdCounter: number;
	constructor() {
		this.#entityMap = new Map();
		this.#entityIdCounter = 0;
	}
	toJson() {
		return JSON.stringify(this.#entityMap);
	}
	fromJson(data: string) {
		this.#entityMap = JSON.parse(data);
	}
	set(id: number, data: any) {
		this.#entityMap[id] = data;
	}
	create(data: any) {
		const id = this.#entityIdCounter++;
		this.set(id, data);
		return id;
	}
	get(id: number) {
		return this.#entityMap[id];
	}
	patch(id: number, data: any) {
		this.set(id, data);
	}
	destroy(id: number) {
		this.#entityMap.delete(id);
	}
}