import EntityRegistry from "../EntityRegistry";
import WebSocketMessager from "./WebSocketMessager";
import WebSocket from "ws";

export default class ServerEntityRegistry {
	#entityRegistry: EntityRegistry;
	#webSocketMessager: WebSocketMessager;
	constructor(webSocketMessager: WebSocketMessager, entityRegistry: EntityRegistry) {
		this.#entityRegistry = entityRegistry;
		this.#webSocketMessager = webSocketMessager;
	}
	sendTo(ws: WebSocket) {
		this.#webSocketMessager.send(ws, 'loadEntities', this.#entityRegistry.toJson());
	}
	create(data: any) {
		const id = this.#entityRegistry.create(data);
		this.#webSocketMessager.sendToAll('updateEntity', { id, data });
		return id;
	}
	get(id: number) {
		return this.#entityRegistry.get(id);
	}
	patch(id: number, data: any) {
		this.#entityRegistry.patch(id, data);
		this.#webSocketMessager.sendToAll('updateEntity', { id, data });
	}
	destroy(id: number) {
		this.#entityRegistry.destroy(id);
		this.#webSocketMessager.sendToAll('destroyEntity', { id });
	}
}