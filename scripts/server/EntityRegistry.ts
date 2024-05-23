import WebSocketMessager from "./WebSocketMessager";

export default class EntityRegistry {
	entityMap: Map<number, any>;
	entityIdCounter: number;
	webSocketMessager: WebSocketMessager;
	constructor(webSocketMessager: WebSocketMessager) {
		this.entityMap = new Map();
		this.webSocketMessager = webSocketMessager;
		this.entityIdCounter = 0;
	}
	create(data: any) {
		const id = this.entityIdCounter++;
		this.entityMap.set(id, data);
		this.webSocketMessager.sendToAll('newEntity', { id, data });
		return id;
	}
	get(id: number) {
		return this.entityMap.get(id);
	}
	patch(id: number, data: any) {
		this.entityMap.set(id, data);
		this.webSocketMessager.sendToAll('patchEntity', { id, data });
	}
	destroy(id: number) {
		this.entityMap.delete(id);
		this.webSocketMessager.sendToAll('destroyEntity', { id });
	}
}