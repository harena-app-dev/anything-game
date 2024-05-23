import WebSocketMessager from "./server/WebSocketMessager";

export default class EntityRegistry {
	entityMap: Map<number, any>;
	entityIdCounter: number;
	constructor() {
		this.entityMap = new Map();
		this.entityIdCounter = 0;
	}
	create(data: any) {
		const id = this.entityIdCounter++;
		this.entityMap.set(id, data);
		return id;
	}
	get(id: number) {
		return this.entityMap.get(id);
	}
	patch(id: number, data: any) {
		this.entityMap.set(id, data);
	}
	destroy(id: number) {
		this.entityMap.delete(id);
	}
}