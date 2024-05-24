import Registry from "../Registry";
import WebSocketMessager from "./WebSocketMessager";
import WebSocket from "ws";

export default class ServerRegistry {
	#entityRegistry: Registry;
	#webSocketMessager: WebSocketMessager;
	constructor(webSocketMessager: WebSocketMessager, entityRegistry: Registry) {
		this.#entityRegistry = entityRegistry;
		this.#webSocketMessager = webSocketMessager;
	}
	sendTo(ws: WebSocket) {
		this.#webSocketMessager.send(ws, 'loadEntities',
			{ data: this.#entityRegistry.toJson() });
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